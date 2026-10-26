const { handleUpload } = require('@vercel/blob/client');
const { checkAuth } = require('../lib/auth');

module.exports = async (req, res) => {
  try {
    const body = req.body;
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let payload = {};
        try { payload = clientPayload ? JSON.parse(clientPayload) : {}; } catch (e) {}
        if (!checkAuth(payload)) {
          throw new Error('Unauthorized');
        }
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
          addRandomSuffix: true,
          maximumSizeInBytes: 50 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => {},
    });
    res.status(200).json(jsonResponse);
  } catch (error) {
    res.status(400).json({ error: String(error && error.message || error) });
  }
};
