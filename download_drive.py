import urllib.request, os, sys

def download(file_id, out_path):
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp, open(out_path, "wb") as f:
            data = resp.read()
            f.write(data)
        print(f"{out_path} -> {len(data)} bytes")
        return len(data)
    except Exception as e:
        print(f"{out_path} -> FAILED: {e}")
        return 0

if __name__ == "__main__":
    import json, time
    if sys.argv[1].endswith(".json") and os.path.isfile(sys.argv[1]):
        manifest = json.load(open(sys.argv[1]))
    else:
        manifest = json.loads(sys.argv[1])
    outdir = sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    failed = {}
    for name, fid in manifest.items():
        out_path = os.path.join(outdir, name)
        if os.path.isfile(out_path) and os.path.getsize(out_path) > 1000:
            print(f"{out_path} -> already exists, skipping")
            continue
        size = download(fid, out_path)
        if size == 0:
            failed[name] = fid
        time.sleep(0.3)
    if failed:
        print("RETRY_NEEDED:", json.dumps(failed))
