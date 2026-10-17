const { checkAuth } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }
  const body = req.body || {};
  if (checkAuth(body)) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: 'Invalid email or token' });
  }
};
