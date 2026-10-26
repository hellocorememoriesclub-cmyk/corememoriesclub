const { checkAuth } = require('../lib/auth');

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-5';

const EXTRACT_PROMPT = `You are reading a travel trip itinerary/brochure PDF for a group travel company. Extract the following fields and return ONLY a JSON object, no other text, no markdown fences:
{
  "title": "trip name, e.g. 'Zurich New Year Escape 2026'",
  "days": "duration, e.g. '5 Days / 4 Nights'",
  "dates": "departure date(s), e.g. 'Dec 28, 2026' or 'Jul 17, Jul 24'",
  "price": "starting price with currency symbol, e.g. '₹1,35,000'",
  "overview": "a 1-2 sentence overview/description of the trip"
}
If a field isn't present in the document, use an empty string for it. Return only valid JSON.`;

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method not allowed' }); return; }
    const body = req.body || {};
    if (!checkAuth(body)) { res.status(401).json({ ok: false, error: 'Unauthorized' }); return; }
    if (!body.data && !body.pdfUrl) { res.status(400).json({ ok: false, error: 'Missing PDF data or pdfUrl' }); return; }
    if (!process.env.ANTHROPIC_API_KEY) {
      res.status(500).json({ ok: false, error: 'AI parsing is not configured yet (missing ANTHROPIC_API_KEY).' });
      return;
    }

    let base64;
    if (body.pdfUrl) {
      const pdfRes = await fetch(body.pdfUrl);
      if (!pdfRes.ok) { res.status(400).json({ ok: false, error: 'Could not fetch the uploaded PDF' }); return; }
      const arrayBuffer = await pdfRes.arrayBuffer();
      base64 = Buffer.from(arrayBuffer).toString('base64');
    } else {
      base64 = String(body.data).split(',').pop();
    }

    const aiRes = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
            { type: 'text', text: EXTRACT_PROMPT },
          ],
        }],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      res.status(502).json({ ok: false, error: `AI request failed: ${aiRes.status} ${errText.slice(0, 300)}` });
      return;
    }

    const aiData = await aiRes.json();
    const textBlock = (aiData.content || []).find(c => c.type === 'text');
    if (!textBlock) { res.status(502).json({ ok: false, error: 'No response from AI' }); return; }

    let extracted;
    try {
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      extracted = JSON.parse(jsonMatch ? jsonMatch[0] : textBlock.text);
    } catch (e) {
      res.status(502).json({ ok: false, error: 'Could not parse AI response as JSON' });
      return;
    }

    res.status(200).json({ ok: true, fields: extracted });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
