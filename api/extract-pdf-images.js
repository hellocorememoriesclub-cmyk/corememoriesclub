const { put } = require('@vercel/blob');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const { checkAuth } = require('../lib/auth');

const OWNER = 'hellocorememoriesclub-cmyk';
const REPO = 'corememoriesclub';
const BRANCH = 'main';
const GITHUB_API = 'https://api.github.com';
const INDEX_PATH = 'data/gallery.json';
const MAX_IMAGES = 20;
const MIN_PIXELS = 300 * 300;
const MIN_BYTES = 15 * 1024;

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

async function ghPutFile(filePath, content, message, sha) {
  const body = { message, content: Buffer.from(content, 'utf-8').toString('base64'), branch: BRANCH };
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

function extractJpegImages(pdfDoc) {
  const seen = new Set();
  const images = [];
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const resources = pages[i].node.Resources();
    if (!resources) continue;
    const xobjDict = resources.lookup(PDFName.of('XObject'));
    if (!xobjDict || !xobjDict.entries) continue;
    for (const [, ref] of xobjDict.entries()) {
      const refKey = ref.toString();
      if (seen.has(refKey)) continue;
      const obj = pdfDoc.context.lookup(ref);
      if (!(obj instanceof PDFRawStream)) continue;
      const dict = obj.dict;
      const subtype = dict.get(PDFName.of('Subtype'));
      if (!subtype || subtype.toString() !== '/Image') continue;
      let filter = dict.get(PDFName.of('Filter'));
      filter = filter ? filter.toString() : '';
      if (!filter.includes('DCTDecode')) continue; // only plain JPEG streams — no re-encoding needed
      const width = dict.get(PDFName.of('Width'));
      const height = dict.get(PDFName.of('Height'));
      const w = width ? width.asNumber() : 0;
      const h = height ? height.asNumber() : 0;
      const bytes = obj.contents;
      if (w * h < MIN_PIXELS || bytes.length < MIN_BYTES) continue;
      seen.add(refKey);
      images.push({ page: i + 1, width: w, height: h, bytes });
    }
  }
  images.sort((a, b) => (b.width * b.height) - (a.width * a.height));
  return images.slice(0, MAX_IMAGES);
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method not allowed' }); return; }
    const body = req.body || {};
    if (!checkAuth(body)) { res.status(401).json({ ok: false, error: 'Unauthorized' }); return; }
    if (!body.pdfUrl || !body.tripTitle) { res.status(400).json({ ok: false, error: 'Missing pdfUrl or tripTitle' }); return; }

    const pdfRes = await fetch(body.pdfUrl);
    if (!pdfRes.ok) { res.status(400).json({ ok: false, error: 'Could not fetch the PDF' }); return; }
    const pdfBytes = Buffer.from(await pdfRes.arrayBuffer());

    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const images = extractJpegImages(pdfDoc);

    if (!images.length) {
      res.status(200).json({ ok: true, count: 0, photos: [] });
      return;
    }

    const slug = slugify(body.tripTitle);
    const uploaded = [];
    for (const img of images) {
      const pathname = `pdf-photos/${slug}/${Date.now()}-page${img.page}.jpg`;
      const blob = await put(pathname, Buffer.from(img.bytes), {
        access: 'public',
        contentType: 'image/jpeg',
        addRandomSuffix: true,
      });
      uploaded.push(blob.url);
    }

    const { data: indexData, sha: indexSha } = await ghGetJson(INDEX_PATH);
    const galleryData = indexData || {};
    if (!galleryData[slug]) galleryData[slug] = { title: body.tripTitle, photos: [] };
    galleryData[slug].title = body.tripTitle;
    galleryData[slug].photos = [...uploaded, ...galleryData[slug].photos];
    await ghPutFile(INDEX_PATH, JSON.stringify(galleryData, null, 2) + '\n', `Add ${uploaded.length} photo(s) extracted from PDF for ${body.tripTitle}`, indexSha);

    res.status(200).json({ ok: true, count: uploaded.length, photos: uploaded, slug });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
