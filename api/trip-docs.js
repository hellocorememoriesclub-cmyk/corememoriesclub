const { checkAuth } = require('../lib/auth');

const OWNER = 'hellocorememoriesclub-cmyk';
const REPO = 'corememoriesclub';
const BRANCH = 'main';
const GITHUB_API = 'https://api.github.com';
const INDEX_PATH = 'data/trip-docs.json';

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
}

function slugify(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'trip';
}

async function ghGetJson(filePath) {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`, { headers: ghHeaders() });
  if (res.status === 404) return { data: null, sha: null };
  if (!res.ok) throw new Error(`GitHub GET ${filePath} failed: ${res.status}`);
  const resData = await res.json();
  const content = Buffer.from(resData.content, 'base64').toString('utf-8');
  return { data: JSON.parse(content || 'null'), sha: resData.sha };
}

async function ghPutFile(filePath, content, message, sha, isBase64Already) {
  const body = {
    message,
    content: isBase64Already ? content : Buffer.from(content, 'utf-8').toString('base64'),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${filePath}`, {
    method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`GitHub PUT ${filePath} failed: ${res.status} ${errBody}`);
  }
  return res.json();
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { data } = await ghGetJson(INDEX_PATH);
      res.status(200).json(data || {});
      return;
    }

    if (req.method === 'POST' && req.query.action === 'upload') {
      const body = req.body || {};
      if (!checkAuth(body)) { res.status(401).json({ ok: false, error: 'Unauthorized' }); return; }
      if (!body.tripTitle || !body.filename || !body.data) {
        res.status(400).json({ ok: false, error: 'Missing tripTitle, filename or data' });
        return;
      }
      if (!/\.pdf$/i.test(body.filename)) {
        res.status(400).json({ ok: false, error: 'Only PDF files are supported' });
        return;
      }
      const slug = slugify(body.tripTitle);
      const safeName = String(body.filename).replace(/[^a-zA-Z0-9._-]/g, '_');
      const docPath = `files/trip-docs/${slug}/${Date.now()}-${safeName}`;
      const base64 = String(body.data).split(',').pop();

      await ghPutFile(docPath, base64, `Upload document for ${body.tripTitle}`, null, true);

      const { data: indexData, sha: indexSha } = await ghGetJson(INDEX_PATH);
      const docsData = indexData || {};
      if (!docsData[slug]) docsData[slug] = { title: body.tripTitle, docs: [] };
      docsData[slug].title = body.tripTitle;
      docsData[slug].docs.unshift({ name: safeName, path: docPath });
      await ghPutFile(INDEX_PATH, JSON.stringify(docsData, null, 2) + '\n', `Add document to ${body.tripTitle}`, indexSha, false);

      res.status(200).json({ ok: true, slug, path: docPath, name: safeName });
      return;
    }

    if (req.method === 'POST' && req.query.action === 'delete') {
      const body = req.body || {};
      if (!checkAuth(body)) { res.status(401).json({ ok: false, error: 'Unauthorized' }); return; }
      if (!body.slug || !body.path) { res.status(400).json({ ok: false, error: 'Missing slug or path' }); return; }
      const { data: indexData, sha: indexSha } = await ghGetJson(INDEX_PATH);
      const docsData = indexData || {};
      if (!docsData[body.slug]) { res.status(404).json({ ok: false, error: 'Trip not found' }); return; }
      docsData[body.slug].docs = docsData[body.slug].docs.filter(d => d.path !== body.path);
      await ghPutFile(INDEX_PATH, JSON.stringify(docsData, null, 2) + '\n', `Remove document from ${body.slug}`, indexSha, false);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
