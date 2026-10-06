#!/usr/bin/env python3
"""Static site + backend API for Core Memories Club — traffic tracking,
bookings/inquiries, live chat, and GPS-aware photo upload."""
import base64
import io
import json
import os
import re
import sqlite3
import sys
import time
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.environ.get("DATA_DIR", ROOT)
DB_PATH = os.path.join(DATA_DIR, "bookings.db")
PHOTOS_DIR = os.path.join(DATA_DIR, "images", "photos")
STATIC_PHOTOS_DIR = os.path.join(ROOT, "images", "photos")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "cmc-admin-2026")
PORT = int(os.environ.get("PORT", "8088"))

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

try:
    from PIL import Image
    from PIL.ExifTags import TAGS, GPSTAGS
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

# ---- Destination bounding boxes (lat_min, lat_max, lon_min, lon_max) ----
# Sorted by area (smallest first) when matching, so specific spots win over broad ones.
DEST_BBOXES = {
    "rishikesh": (29.9, 30.3, 78.1, 78.4),
    "goa": (15.0, 15.9, 73.6, 74.2),
    "ibiza": (38.85, 39.15, 1.25, 1.70),
    "zurich": (47.25, 47.50, 8.40, 8.70),
    "paris": (48.75, 48.95, 2.10, 2.55),
    "hungary": (47.35, 47.65, 18.9, 19.25),
    "dubai": (24.7, 25.5, 54.8, 55.7),
    "kerala": (8.0, 12.9, 74.7, 77.5),
    "bali": (-8.9, -8.0, 114.4, 115.7),
    "tomorrowland": (50.9, 51.3, 4.1, 4.6),
    "egypt": (22.0, 31.7, 24.5, 35.0),
    "iceland": (63.0, 66.6, -24.5, -13.0),
    "vietnam": (8.0, 23.4, 102.0, 109.5),
    "thailand": (5.5, 20.5, 97.3, 105.6),
    "chile": (-56.0, -17.5, -75.8, -66.0),
    "newzealand": (-47.5, -34.0, 166.0, 179.0),
    "mexico": (14.0, 32.7, -118.5, -86.0),
}
DEST_ORDER = sorted(
    DEST_BBOXES,
    key=lambda k: (DEST_BBOXES[k][1] - DEST_BBOXES[k][0]) * (DEST_BBOXES[k][3] - DEST_BBOXES[k][2]),
)

FILENAME_KEYWORDS = {
    "ibiza": "ibiza", "paris": "paris", "zurich": "zurich", "iceland": "iceland",
    "belgium": "tomorrowland", "tomorrowland": "tomorrowland", "mexico": "mexico",
    "dubai": "dubai", "vietnam": "vietnam", "newzealand": "newzealand",
    "new-zealand": "newzealand", "new_zealand": "newzealand", "nz": "newzealand",
    "goa": "goa", "kerala": "kerala", "rishikesh": "rishikesh", "egypt": "egypt",
    "giza": "egypt", "luxor": "egypt", "budapest": "hungary", "hungary": "hungary",
    "chile": "chile", "bali": "bali", "thailand": "thailand", "koh": "thailand",
}

DEST_LABELS = {
    "ibiza": "Ibiza", "paris": "Paris", "zurich": "Zurich", "iceland": "Iceland",
    "tomorrowland": "Belgium (Tomorrowland)", "mexico": "Mexico", "dubai": "Dubai",
    "vietnam": "Vietnam", "newzealand": "New Zealand", "goa": "Goa", "kerala": "Kerala",
    "rishikesh": "Rishikesh", "egypt": "Egypt", "hungary": "Hungary", "chile": "Chile",
    "bali": "Bali", "thailand": "Thailand", "unsorted": "Unsorted",
}


def init_db():
    con = sqlite3.connect(DB_PATH)
    con.execute(
        """CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT, created_at INTEGER NOT NULL,
            name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL,
            destination TEXT, group_size TEXT, dates TEXT, budget TEXT, message TEXT,
            status TEXT NOT NULL DEFAULT 'new'
        )"""
    )
    con.execute(
        """CREATE TABLE IF NOT EXISTS pageviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL,
            referrer TEXT, user_agent TEXT, created_at INTEGER NOT NULL
        )"""
    )
    con.execute(
        """CREATE TABLE IF NOT EXISTS gallery_photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT, tour_slug TEXT NOT NULL,
            filename TEXT NOT NULL, detection_method TEXT, caption TEXT,
            uploaded_at INTEGER NOT NULL
        )"""
    )
    con.execute(
        """CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT NOT NULL,
            visitor_name TEXT, sender TEXT NOT NULL, message TEXT NOT NULL,
            created_at INTEGER NOT NULL, read_by_admin INTEGER DEFAULT 0,
            read_by_visitor INTEGER DEFAULT 0
        )"""
    )
    con.commit()
    con.close()


# ---------------------------------------------------------------- bookings
def insert_booking(data):
    con = sqlite3.connect(DB_PATH)
    cur = con.execute(
        """INSERT INTO bookings
           (created_at, name, phone, email, destination, group_size, dates, budget, message, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')""",
        (int(time.time()), data["name"], data["phone"], data["email"],
         data.get("destination", ""), data.get("group_size", ""), data.get("dates", ""),
         data.get("budget", ""), data.get("message", "")),
    )
    con.commit()
    bid = cur.lastrowid
    con.close()
    return bid


def list_bookings():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    rows = con.execute("SELECT * FROM bookings ORDER BY created_at DESC").fetchall()
    con.close()
    return [dict(r) for r in rows]


def update_status(booking_id, status):
    con = sqlite3.connect(DB_PATH)
    cur = con.execute("UPDATE bookings SET status = ? WHERE id = ?", (status, booking_id))
    con.commit()
    changed = cur.rowcount
    con.close()
    return changed > 0


# ---------------------------------------------------------------- pageviews / traffic
PAGEVIEW_SKIP_PREFIXES = ("/api/", "/css/", "/js/", "/images/", "/favicon")


def should_log_pageview(path):
    if any(path.startswith(p) for p in PAGEVIEW_SKIP_PREFIXES):
        return False
    if "." in path.rsplit("/", 1)[-1] and not path.endswith(".html"):
        return False
    return True


def log_pageview(path, referrer, user_agent):
    con = sqlite3.connect(DB_PATH)
    con.execute(
        "INSERT INTO pageviews (path, referrer, user_agent, created_at) VALUES (?, ?, ?, ?)",
        (path, referrer or "", user_agent or "", int(time.time())),
    )
    con.commit()
    con.close()


def traffic_report():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    total = con.execute("SELECT COUNT(*) c FROM pageviews").fetchone()["c"]
    now = int(time.time())
    last_24h = con.execute(
        "SELECT COUNT(*) c FROM pageviews WHERE created_at > ?", (now - 86400,)
    ).fetchone()["c"]
    last_7d = con.execute(
        "SELECT COUNT(*) c FROM pageviews WHERE created_at > ?", (now - 7 * 86400,)
    ).fetchone()["c"]
    top_pages = con.execute(
        "SELECT path, COUNT(*) c FROM pageviews GROUP BY path ORDER BY c DESC LIMIT 12"
    ).fetchall()
    top_referrers = con.execute(
        "SELECT referrer, COUNT(*) c FROM pageviews WHERE referrer != '' GROUP BY referrer ORDER BY c DESC LIMIT 8"
    ).fetchall()
    # last 14 days daily counts
    daily = []
    for i in range(13, -1, -1):
        day_start = now - i * 86400 - (now % 86400)
        day_end = day_start + 86400
        c = con.execute(
            "SELECT COUNT(*) c FROM pageviews WHERE created_at >= ? AND created_at < ?",
            (day_start, day_end),
        ).fetchone()["c"]
        daily.append({"day": time.strftime("%d %b", time.localtime(day_start)), "count": c})
    con.close()
    return {
        "total": total,
        "last_24h": last_24h,
        "last_7d": last_7d,
        "top_pages": [dict(r) for r in top_pages],
        "top_referrers": [dict(r) for r in top_referrers],
        "daily": daily,
    }


# ---------------------------------------------------------------- photo upload / gallery
def to_decimal(coords, ref):
    d, m, s = coords
    dec = float(d) + float(m) / 60 + float(s) / 3600
    if ref in ("S", "W"):
        dec = -dec
    return dec


def extract_gps(image_bytes):
    if not HAS_PIL:
        return None
    try:
        img = Image.open(io.BytesIO(image_bytes))
        exif = img._getexif()
        if not exif:
            return None
        gps_info = {}
        for tag_id, value in exif.items():
            if TAGS.get(tag_id, tag_id) == "GPSInfo":
                for gps_id, gps_val in value.items():
                    gps_info[GPSTAGS.get(gps_id, gps_id)] = gps_val
        if "GPSLatitude" not in gps_info:
            return None
        lat = to_decimal(gps_info["GPSLatitude"], gps_info.get("GPSLatitudeRef", "N"))
        lon = to_decimal(gps_info["GPSLongitude"], gps_info.get("GPSLongitudeRef", "E"))
        return (lat, lon)
    except Exception:
        return None


def detect_destination(image_bytes, filename):
    gps = extract_gps(image_bytes)
    if gps:
        lat, lon = gps
        for slug in DEST_ORDER:
            lat_min, lat_max, lon_min, lon_max = DEST_BBOXES[slug]
            if lat_min <= lat <= lat_max and lon_min <= lon <= lon_max:
                return slug, "gps", {"lat": round(lat, 4), "lon": round(lon, 4)}
        return "unsorted", "gps-no-match", {"lat": round(lat, 4), "lon": round(lon, 4)}

    lower = filename.lower()
    for kw, slug in FILENAME_KEYWORDS.items():
        if kw in lower:
            return slug, "filename", None

    return "unsorted", "none", None


def save_uploaded_photo(filename, raw_bytes, override_slug=None):
    safe_name = re.sub(r"[^A-Za-z0-9._-]", "_", filename) or f"upload-{int(time.time())}.jpg"
    base, ext = os.path.splitext(safe_name)
    ext = ext.lower() if ext.lower() in (".jpg", ".jpeg", ".png", ".webp") else ".jpg"

    if override_slug:
        slug, method, gps = override_slug, "manual", None
    else:
        slug, method, gps = detect_destination(raw_bytes, filename)

    target_dir = os.path.join(PHOTOS_DIR, slug)
    os.makedirs(target_dir, exist_ok=True)

    final_name = f"{base}{ext}"
    dest_path = os.path.join(target_dir, final_name)
    i = 1
    while os.path.isfile(dest_path):
        final_name = f"{base}-{i}{ext}"
        dest_path = os.path.join(target_dir, final_name)
        i += 1

    with open(dest_path, "wb") as f:
        f.write(raw_bytes)

    con = sqlite3.connect(DB_PATH)
    con.execute(
        "INSERT INTO gallery_photos (tour_slug, filename, detection_method, caption, uploaded_at) VALUES (?, ?, ?, ?, ?)",
        (slug, final_name, method, DEST_LABELS.get(slug, slug.title()), int(time.time())),
    )
    con.commit()
    con.close()

    return {
        "slug": slug,
        "label": DEST_LABELS.get(slug, slug.title()),
        "method": method,
        "gps": gps,
        "filename": final_name,
        "url": f"/images/photos/{slug}/{final_name}",
    }


def move_photo(current_slug, filename, new_slug):
    src_path = os.path.join(PHOTOS_DIR, current_slug, filename)
    if not os.path.isfile(src_path):
        return {"ok": False, "error": "Source file not found"}

    target_dir = os.path.join(PHOTOS_DIR, new_slug)
    os.makedirs(target_dir, exist_ok=True)
    base, ext = os.path.splitext(filename)
    final_name = filename
    dest_path = os.path.join(target_dir, final_name)
    i = 1
    while os.path.isfile(dest_path) and current_slug != new_slug:
        final_name = f"{base}-{i}{ext}"
        dest_path = os.path.join(target_dir, final_name)
        i += 1

    os.rename(src_path, dest_path)

    con = sqlite3.connect(DB_PATH)
    con.execute(
        "UPDATE gallery_photos SET tour_slug = ?, filename = ?, detection_method = 'manual', caption = ? "
        "WHERE tour_slug = ? AND filename = ?",
        (new_slug, final_name, DEST_LABELS.get(new_slug, new_slug.title()), current_slug, filename),
    )
    con.commit()
    con.close()

    return {"ok": True, "slug": new_slug, "filename": final_name, "url": f"/images/photos/{new_slug}/{final_name}"}


def list_gallery_photos(tour_slug=None):
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    if tour_slug:
        rows = con.execute(
            "SELECT * FROM gallery_photos WHERE tour_slug = ? ORDER BY uploaded_at DESC", (tour_slug,)
        ).fetchall()
    else:
        rows = con.execute("SELECT * FROM gallery_photos ORDER BY uploaded_at DESC").fetchall()
    con.close()
    out = []
    for r in rows:
        d = dict(r)
        d["url"] = f"/images/photos/{d['tour_slug']}/{d['filename']}"
        out.append(d)
    return out


# ---------------------------------------------------------------- live chat
def chat_send(session_id, visitor_name, sender, message):
    con = sqlite3.connect(DB_PATH)
    con.execute(
        """INSERT INTO chat_messages (session_id, visitor_name, sender, message, created_at, read_by_admin, read_by_visitor)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (session_id, visitor_name or "", sender, message, int(time.time()),
         1 if sender == "admin" else 0, 1 if sender == "visitor" else 0),
    )
    con.commit()
    con.close()


def chat_poll(session_id, since=0):
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        "SELECT * FROM chat_messages WHERE session_id = ? AND created_at > ? ORDER BY created_at ASC",
        (session_id, since),
    ).fetchall()
    con.execute(
        "UPDATE chat_messages SET read_by_admin = 1 WHERE session_id = ? AND sender = 'visitor'",
        (session_id,),
    )
    con.commit()
    con.close()
    return [dict(r) for r in rows]


def chat_sessions():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    rows = con.execute(
        """SELECT session_id,
                  MAX(created_at) last_at,
                  (SELECT visitor_name FROM chat_messages m2 WHERE m2.session_id = m1.session_id AND visitor_name != '' ORDER BY created_at DESC LIMIT 1) visitor_name,
                  (SELECT message FROM chat_messages m3 WHERE m3.session_id = m1.session_id ORDER BY created_at DESC LIMIT 1) last_message,
                  SUM(CASE WHEN sender = 'visitor' AND read_by_admin = 0 THEN 1 ELSE 0 END) unread
           FROM chat_messages m1
           GROUP BY session_id
           ORDER BY last_at DESC"""
    ).fetchall()
    con.close()
    return [dict(r) for r in rows]


STATIC_EXTS = {
    ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8", ".svg": "image/svg+xml",
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".webp": "image/webp", ".json": "application/json", ".ico": "image/x-icon",
}


class Handler(BaseHTTPRequestHandler):
    server_version = "CoreMemoriesClub/2.0"

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path):
        if not os.path.isfile(path):
            self._send_json(404, {"ok": False, "error": "Not found"})
            return
        ext = os.path.splitext(path)[1].lower()
        ctype = STATIC_EXTS.get(ext, "application/octet-stream")
        with open(path, "rb") as f:
            body = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _check_token(self, qs):
        return (qs.get("token") or [""])[0] == ADMIN_TOKEN

    def _read_json_body(self):
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b""
        return json.loads(raw or b"{}")

    # ------------------------------------------------------------ GET
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        qs = parse_qs(parsed.query)

        if path == "/api/bookings":
            if not self._check_token(qs):
                self._send_json(401, {"ok": False, "error": "Unauthorized"})
                return
            self._send_json(200, {"ok": True, "bookings": list_bookings()})
            return

        if path == "/api/traffic":
            if not self._check_token(qs):
                self._send_json(401, {"ok": False, "error": "Unauthorized"})
                return
            self._send_json(200, {"ok": True, "report": traffic_report()})
            return

        if path == "/api/photos":
            tour = (qs.get("tour") or [None])[0]
            self._send_json(200, {"ok": True, "photos": list_gallery_photos(tour)})
            return

        if path == "/api/chat/sessions":
            if not self._check_token(qs):
                self._send_json(401, {"ok": False, "error": "Unauthorized"})
                return
            self._send_json(200, {"ok": True, "sessions": chat_sessions()})
            return

        if path == "/api/chat/poll":
            session_id = (qs.get("session") or [""])[0]
            since = int((qs.get("since") or ["0"])[0] or 0)
            if not session_id:
                self._send_json(400, {"ok": False, "error": "session required"})
                return
            self._send_json(200, {"ok": True, "messages": chat_poll(session_id, since)})
            return

        if path == "/api/health":
            self._send_json(200, {"ok": True, "status": "up", "pil": HAS_PIL})
            return

        # static file serving + pageview logging
        if path == "/":
            path = "/index.html"
        safe_path = os.path.normpath(path).lstrip("/")
        full_path = os.path.join(ROOT, safe_path)
        if not full_path.startswith(ROOT):
            self._send_json(403, {"ok": False, "error": "Forbidden"})
            return
        if os.path.isdir(full_path):
            full_path = os.path.join(full_path, "index.html")

        if not os.path.isfile(full_path) and safe_path.startswith("images/photos/"):
            volume_path = os.path.join(DATA_DIR, safe_path)
            if os.path.isfile(volume_path):
                full_path = volume_path

        if should_log_pageview(parsed.path):
            log_pageview(
                parsed.path if parsed.path != "/" else "/index.html",
                self.headers.get("Referer", ""),
                self.headers.get("User-Agent", ""),
            )
        self._send_file(full_path)

    def do_HEAD(self):
        path = urlparse(self.path).path
        if path == "/":
            path = "/index.html"
        full_path = os.path.join(ROOT, path.lstrip("/"))
        if os.path.isfile(full_path):
            ext = os.path.splitext(full_path)[1].lower()
            self.send_response(200)
            self.send_header("Content-Type", STATIC_EXTS.get(ext, "application/octet-stream"))
            self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

    # ------------------------------------------------------------ POST
    def do_POST(self):
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)

        if parsed.path == "/api/bookings":
            try:
                data = self._read_json_body()
            except json.JSONDecodeError:
                self._send_json(400, {"ok": False, "error": "Invalid JSON"})
                return

            name = (data.get("name") or "").strip()
            phone = (data.get("phone") or "").strip()
            email = (data.get("email") or "").strip()

            errors = {}
            if not name:
                errors["name"] = "Name is required"
            if not phone or len(re.sub(r"\D", "", phone)) < 7:
                errors["phone"] = "A valid phone number is required"
            if not email or not EMAIL_RE.match(email):
                errors["email"] = "A valid email is required"
            if errors:
                self._send_json(422, {"ok": False, "errors": errors})
                return

            booking_id = insert_booking({
                "name": name, "phone": phone, "email": email,
                "destination": data.get("destination", ""), "group_size": str(data.get("group_size", "")),
                "dates": data.get("dates", ""), "budget": data.get("budget", ""), "message": data.get("message", ""),
            })
            self._send_json(201, {"ok": True, "id": booking_id})
            return

        if re.match(r"^/api/bookings/\d+/status$", parsed.path):
            if not self._check_token(qs):
                self._send_json(401, {"ok": False, "error": "Unauthorized"})
                return
            booking_id = int(parsed.path.split("/")[3])
            try:
                data = self._read_json_body()
            except json.JSONDecodeError:
                self._send_json(400, {"ok": False, "error": "Invalid JSON"})
                return
            status = data.get("status", "")
            if status not in ("new", "contacted", "confirmed", "closed"):
                self._send_json(422, {"ok": False, "error": "Invalid status"})
                return
            ok = update_status(booking_id, status)
            self._send_json(200 if ok else 404, {"ok": ok})
            return

        if parsed.path == "/api/upload":
            if not self._check_token(qs):
                self._send_json(401, {"ok": False, "error": "Unauthorized"})
                return
            try:
                data = self._read_json_body()
            except json.JSONDecodeError:
                self._send_json(400, {"ok": False, "error": "Invalid JSON"})
                return
            filename = data.get("filename", "upload.jpg")
            b64 = data.get("data", "")
            override = data.get("override_slug") or None
            if not b64:
                self._send_json(400, {"ok": False, "error": "No file data"})
                return
            try:
                raw_bytes = base64.b64decode(b64.split(",")[-1])
            except Exception:
                self._send_json(400, {"ok": False, "error": "Invalid file data"})
                return
            if len(raw_bytes) > 15 * 1024 * 1024:
                self._send_json(413, {"ok": False, "error": "File too large (max 15MB)"})
                return
            result = save_uploaded_photo(filename, raw_bytes, override)
            self._send_json(201, {"ok": True, **result})
            return

        if parsed.path == "/api/photos/move":
            if not self._check_token(qs):
                self._send_json(401, {"ok": False, "error": "Unauthorized"})
                return
            try:
                data = self._read_json_body()
            except json.JSONDecodeError:
                self._send_json(400, {"ok": False, "error": "Invalid JSON"})
                return
            current_slug = data.get("current_slug", "")
            filename = data.get("filename", "")
            new_slug = data.get("new_slug", "")
            if not (current_slug and filename and new_slug):
                self._send_json(400, {"ok": False, "error": "current_slug, filename and new_slug required"})
                return
            result = move_photo(current_slug, filename, new_slug)
            self._send_json(200 if result.get("ok") else 404, result)
            return

        if parsed.path == "/api/chat/send":
            try:
                data = self._read_json_body()
            except json.JSONDecodeError:
                self._send_json(400, {"ok": False, "error": "Invalid JSON"})
                return
            session_id = (data.get("session") or "").strip()
            sender = data.get("sender", "visitor")
            message = (data.get("message") or "").strip()
            visitor_name = data.get("visitor_name", "")
            if sender == "admin" and not self._check_token(qs):
                self._send_json(401, {"ok": False, "error": "Unauthorized"})
                return
            if not session_id or not message:
                self._send_json(400, {"ok": False, "error": "session and message required"})
                return
            chat_send(session_id, visitor_name, sender if sender == "admin" else "visitor", message)
            self._send_json(201, {"ok": True})
            return

        self._send_json(404, {"ok": False, "error": "Not found"})


if __name__ == "__main__":
    init_db()
    os.makedirs(PHOTOS_DIR, exist_ok=True)
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Core Memories Club server running on http://localhost:{PORT}")
    print(f"Admin API token: {ADMIN_TOKEN}")
    print(f"Pillow (EXIF GPS support): {'available' if HAS_PIL else 'NOT AVAILABLE — filename matching only'}")
    server.serve_forever()
