const { checkAuth } = require('../lib/auth');

const OWNER = 'hellocorememoriesclub-cmyk';
const REPO = 'corememoriesclub';
const BRANCH = 'main';
const GITHUB_API = 'https://api.github.com';
const FILE_PATH = 'data/bookings.json';

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
}

async function ghGetBookings() {
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, { headers: ghHeaders() });
  if (res.status === 404) return { bookings: [], sha: null };
  if (!res.ok) throw new Error(`GitHub GET ${FILE_PATH} failed: ${res.status}`);
  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { bookings: JSON.parse(content || '[]'), sha: data.sha };
}

async function ghPutBookings(bookings, message, sha) {
  const body = {
    message,
    content: Buffer.from(JSON.stringify(bookings, null, 2) + '\n', 'utf-8').toString('base64'),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
    method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`GitHub PUT ${FILE_PATH} failed: ${res.status} ${errBody}`);
  }
  return res.json();
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST' && req.query.action === 'status') {
      if (!checkAuth(req.query)) { res.status(401).json({ ok: false, error: 'Unauthorized' }); return; }
      const { bookings, sha } = await ghGetBookings();
      const idx = bookings.findIndex(b => String(b.id) === String(req.query.id));
      if (idx === -1) { res.status(404).json({ ok: false, error: 'Not found' }); return; }
      bookings[idx].status = (req.body || {}).status || bookings[idx].status;
      await ghPutBookings(bookings, 'Update inquiry status via admin panel', sha);
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const errors = {};
      if (!body.name || !String(body.name).trim()) errors.name = 'Name is required';
      if (!body.phone || !String(body.phone).trim()) errors.phone = 'Phone is required';
      if (!body.email || !String(body.email).trim()) errors.email = 'Email is required';
      if (Object.keys(errors).length) { res.status(422).json({ ok: false, errors }); return; }

      const { bookings, sha } = await ghGetBookings();
      const entry = {
        id: Date.now(),
        created_at: Math.floor(Date.now() / 1000),
        name: String(body.name).trim(),
        phone: String(body.phone).trim(),
        email: String(body.email).trim(),
        destination: body.destination || '',
        group_size: body.group_size || '',
        message: body.message || '',
        status: 'new',
      };
      bookings.unshift(entry);
      await ghPutBookings(bookings, `New inquiry from ${entry.name}`, sha);
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === 'GET') {
      if (!checkAuth(req.query)) { res.status(401).json({ ok: false, error: 'Unauthorized' }); return; }
      const { bookings } = await ghGetBookings();
      res.status(200).json({ bookings });
      return;
    }

    res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
