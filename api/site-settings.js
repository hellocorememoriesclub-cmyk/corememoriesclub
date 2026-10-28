const { checkAuth } = require('../lib/auth');

const OWNER = 'hellocorememoriesclub-cmyk';
const REPO = 'corememoriesclub';
const BRANCH = 'main';
const GITHUB_API = 'https://api.github.com';
const SETTINGS_PATH = 'data/site-settings.json';
const LOGO_PATH = 'images/photos/logo.png';

const DEFAULTS = {
  phone: '+91 99285 45123',
  email: 'hello@corememoriesclub.com',
  address: 'Mumbai, India',
  travellers: '1,000+',
  destinations: '30+',
  rating: '4.8',
  support: '24/7',
  igFollowers: '1.2k+',
  tripsRun: '50+',
  founderName: 'Chitranshu',
  cofounderName: 'Dheeraj',
};

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
}

async function ghGetJson(filePath) {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`, { headers: ghHeaders() });
  if (res.status === 404) return { data: null, sha: null };
  if (!res.ok) throw new Error(`GitHub GET ${filePath} failed: ${res.status}`);
  const resData = await res.json();
  const content = Buffer.from(resData.content, 'base64').toString('utf-8');
  return { data: JSON.parse(content || 'null'), sha: resData.sha };
}

async function ghGetFileSha(filePath) {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`, { headers: ghHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${filePath} failed: ${res.status}`);
  const data = await res.json();
  return data.sha;
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
      const { data } = await ghGetJson(SETTINGS_PATH);
      res.status(200).json({ ...DEFAULTS, ...(data || {}) });
      return;
    }

    if (req.method === 'POST' && req.query.action === 'save') {
      const body = req.body || {};
      if (!checkAuth(body)) { res.status(401).json({ ok: false, error: 'Unauthorized' }); return; }
      const { data: current, sha } = await ghGetJson(SETTINGS_PATH);
      const updated = { ...DEFAULTS, ...(current || {}) };
      if (typeof body.phone === 'string') updated.phone = body.phone.trim();
      if (typeof body.contactEmail === 'string') updated.email = body.contactEmail.trim();
      if (typeof body.address === 'string') updated.address = body.address.trim();
      if (typeof body.travellers === 'string') updated.travellers = body.travellers.trim();
      if (typeof body.destinations === 'string') updated.destinations = body.destinations.trim();
      if (typeof body.rating === 'string') updated.rating = body.rating.trim();
      if (typeof body.support === 'string') updated.support = body.support.trim();
      if (typeof body.igFollowers === 'string') updated.igFollowers = body.igFollowers.trim();
      if (typeof body.tripsRun === 'string') updated.tripsRun = body.tripsRun.trim();
      if (typeof body.founderName === 'string') updated.founderName = body.founderName.trim();
      if (typeof body.cofounderName === 'string') updated.cofounderName = body.cofounderName.trim();
      await ghPutFile(SETTINGS_PATH, JSON.stringify(updated, null, 2) + '\n', 'Update site settings via admin panel', sha, false);
      res.status(200).json({ ok: true, settings: updated });
      return;
    }

    if (req.method === 'POST' && req.query.action === 'upload-logo') {
      const body = req.body || {};
      if (!checkAuth(body)) { res.status(401).json({ ok: false, error: 'Unauthorized' }); return; }
      if (!body.data) { res.status(400).json({ ok: false, error: 'Missing image data' }); return; }
      const base64 = String(body.data).split(',').pop();
      const sha = await ghGetFileSha(LOGO_PATH);
      await ghPutFile(LOGO_PATH, base64, 'Update site logo via admin panel', sha, true);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
