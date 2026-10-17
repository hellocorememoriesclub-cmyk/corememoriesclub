const fs = require('fs');
const path = require('path');
const { checkAuth } = require('../lib/auth');

const OWNER = 'hellocorememoriesclub-cmyk';
const REPO = 'corememoriesclub';
const BRANCH = 'main';
const GITHUB_API = 'https://api.github.com';

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
}

async function ghGetFile(filePath) {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`,
    { headers: ghHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub GET ${filePath} failed: ${res.status}`);
  const data = await res.json();
  return {
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
    sha: data.sha,
  };
}

async function ghPutFile(filePath, content, message, sha) {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      sha,
      branch: BRANCH,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub PUT ${filePath} failed: ${res.status} ${body}`);
  }
  return res.json();
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderUpcomingCard(t) {
  return `        <div class="pkg-card">
          <div class="pkg-media">
            <img src="${esc(t.image)}" alt="${esc(t.alt)}">
            <span class="pkg-tag">${esc(t.badge)}</span>
          </div>
          <div class="pkg-body">
            <div class="pkg-days">${esc(t.days)}</div>
            <h3><a href="${esc(t.link)}" style="color:inherit">${esc(t.title)}</a></h3>
            <div class="pkg-dates">${esc(t.dates)}</div>
            <div class="pkg-price-row">
              <div class="pkg-price"><span class="label">Starting</span><br><strong>${esc(t.price)}</strong></div>
              <a href="${esc(t.link)}" class="btn btn-dark btn-sm">View Details</a>
            </div>
          </div>
        </div>`;
}

function renderPreviousCard(t) {
  return `        <a class="pkg-card" href="gallery.html" style="display:block">
          <div class="pkg-media">
            <img src="${esc(t.image)}" alt="${esc(t.alt)}">
            <span class="pkg-tag">✓ Completed</span>
          </div>
          <div class="pkg-body">
            <h3>${esc(t.title)}</h3>
            <div class="pkg-dates">${esc(t.date)}</div>
          </div>
        </a>`;
}

function spliceSection(html, markerName, innerHtml) {
  const start = `<!-- TRIPS:${markerName}:START -->`;
  const end = `<!-- TRIPS:${markerName}:END -->`;
  const re = new RegExp(
    start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  if (!re.test(html)) throw new Error(`Markers for ${markerName} not found in index.html`);
  return html.replace(re, `${start}\n${innerHtml}\n      ${end}`);
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const localPath = path.join(process.cwd(), 'data', 'trips.json');
      const raw = fs.readFileSync(localPath, 'utf-8');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(raw);
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e) });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      if (!checkAuth(body)) {
        res.status(401).json({ ok: false, error: 'Unauthorized' });
        return;
      }
      const trips = body.trips;
      if (!trips || !Array.isArray(trips.upcoming) || !Array.isArray(trips.previous)) {
        res.status(400).json({ ok: false, error: 'Invalid trips payload' });
        return;
      }

      const tripsJson = JSON.stringify(trips, null, 2) + '\n';
      const { sha: tripsSha } = await ghGetFile('data/trips.json');
      await ghPutFile('data/trips.json', tripsJson, 'Update trips data via admin panel', tripsSha);

      const { content: indexHtml, sha: indexSha } = await ghGetFile('index.html');
      let updated = indexHtml;
      updated = spliceSection(
        updated,
        'UPCOMING',
        trips.upcoming.map(renderUpcomingCard).join('\n')
      );
      updated = spliceSection(
        updated,
        'PREVIOUS',
        trips.previous.map(renderPreviousCard).join('\n')
      );
      await ghPutFile('index.html', updated, 'Regenerate trips sections via admin panel', indexSha);

      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e) });
    }
    return;
  }

  res.status(405).json({ ok: false, error: 'Method not allowed' });
};
