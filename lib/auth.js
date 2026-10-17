function checkAuth(body) {
  const email = (body.email || '').trim().toLowerCase();
  const token = body.token || '';
  return (
    email === (process.env.ADMIN_EMAIL || '').trim().toLowerCase() &&
    token === process.env.ADMIN_TOKEN
  );
}

module.exports = { checkAuth };
