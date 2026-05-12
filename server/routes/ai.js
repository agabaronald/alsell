const router = require('express').Router();
const Anthropic = require('@anthropic-ai/sdk');
const auth = require('../middleware/auth');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Generate listing description
router.post('/describe', auth, async (req, res) => {
  const { title, category, condition, price } = req.body;
  if (!title || !category)
    return res.status(400).json({ error: 'title and category required' });
  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Write a short, compelling marketplace listing description for this item:
Title: ${title}
Category: ${category}
Condition: ${condition || 'Used'}
Price: ${price ? 'UGX ' + Number(price).toLocaleString() : 'not set'}

Write 2-3 sentences. Be honest, specific and persuasive. No fluff. Do not include the price or title in the description.`,
      }],
    });
    const description = message.content[0].text.trim();
    res.json({ description });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ error: 'Failed to generate description' });
  }
});

// Suggest price
router.post('/price', auth, async (req, res) => {
  const { title, category, condition } = req.body;
  if (!title || !category)
    return res.status(400).json({ error: 'title and category required' });
  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `Suggest a fair resale price in Ugandan Shillings (UGX) for this second-hand item:
Title: ${title}
Category: ${category}
Condition: ${condition || 'Used'}

Respond with ONLY a JSON object like this: {"min": 500000, "max": 800000, "suggested": 650000}
No explanation, just the JSON.`,
      }],
    });
    const raw = message.content[0].text.trim();
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (err) {
    console.error('Price AI error:', err.message);
    res.status(500).json({ error: 'Failed to suggest price' });
  }
});

module.exports = router;