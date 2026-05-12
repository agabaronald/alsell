const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get messages for an offer
router.get('/:offer_id', auth, async (req, res) => {
  try {
    const offer = await db.query(
      `SELECT o.*, l.user_id as seller_id
       FROM offers o LEFT JOIN listings l ON o.listing_id = l.id
       WHERE o.id=$1`,
      [req.params.offer_id]
    );
    if (!offer.rows.length) return res.status(404).json({ error: 'Offer not found' });
    const o = offer.rows[0];
    if (o.buyer_id !== req.user.id && o.seller_id !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });

    const result = await db.query(
      `SELECT m.*, u.username as sender_name
       FROM messages m LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.offer_id=$1 ORDER BY m.sent_at ASC`,
      [req.params.offer_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  const { offer_id, body } = req.body;
  if (!offer_id || !body) return res.status(400).json({ error: 'offer_id and body required' });
  try {
    const result = await db.query(
      `INSERT INTO messages (offer_id, sender_id, body)
       VALUES ($1, $2, $3) RETURNING *`,
      [offer_id, req.user.id, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;