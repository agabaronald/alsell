const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Make an offer
router.post('/', auth, async (req, res) => {
  console.log('Offer body received:', req.body);
  const { listing_id, amount } = req.body;
  if (!listing_id || !amount)
    return res.status(400).json({ error: 'listing_id and amount required' });
  try {
    const listing = await db.query('SELECT * FROM listings WHERE id=$1', [listing_id]);
    if (!listing.rows.length) return res.status(404).json({ error: 'Listing not found' });
    if (listing.rows[0].user_id === req.user.id)
      return res.status(400).json({ error: 'Cannot make offer on your own listing' });
    const result = await db.query(
      `INSERT INTO offers (listing_id, buyer_id, amount) VALUES ($1, $2, $3) RETURNING *`,
      [listing_id, req.user.id, amount]
    );
    const offer = result.rows[0];
    await db.query(
      `INSERT INTO notifications (user_id, type, message) VALUES ($1, 'new_offer', $2)`,
      [listing.rows[0].user_id, `New offer of UGX ${Number(amount).toLocaleString()} on "${listing.rows[0].title}"`]
    );
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all offers for current user
router.get('/mine', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT o.*,
        l.title as listing_title, l.price as listing_price,
        l.category, l.user_id as seller_id,
        u.username as buyer_name
       FROM offers o
       LEFT JOIN listings l ON o.listing_id = l.id
       LEFT JOIN users u ON o.buyer_id = u.id
       WHERE o.buyer_id=$1 OR l.user_id=$1
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single offer
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT o.*,
        l.title as listing_title, l.price as listing_price,
        l.category, l.user_id as seller_id,
        u.username as buyer_name
       FROM offers o
       LEFT JOIN listings l ON o.listing_id = l.id
       LEFT JOIN users u ON o.buyer_id = u.id
       WHERE o.id=$1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Offer not found' });
    const o = result.rows[0];
    if (o.buyer_id !== req.user.id && o.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(o);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept offer
router.patch('/:id/accept', auth, async (req, res) => {
  console.log('Accept attempt — req.user.id:', req.user.id);
  try {
    const offer = await db.query(
      `SELECT o.*, l.user_id as seller_id, l.title
       FROM offers o LEFT JOIN listings l ON o.listing_id = l.id
       WHERE o.id=$1`,
      [req.params.id]
    );
    if (!offer.rows.length) return res.status(404).json({ error: 'Offer not found' });
    console.log('seller_id from DB:', offer.rows[0].seller_id);
    console.log('Match:', offer.rows[0].seller_id === req.user.id);
    if (offer.rows[0].seller_id !== req.user.id)
      return res.status(403).json({ error: 'Only the seller can accept offers' });
    const result = await db.query(
      `UPDATE offers SET status='accepted', updated_at=NOW() WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    await db.query(
      `UPDATE listings SET status='reserved' WHERE id=$1`,
      [offer.rows[0].listing_id]
    );
    await db.query(
      `INSERT INTO notifications (user_id, type, message) VALUES ($1, 'offer_accepted', $2)`,
      [offer.rows[0].buyer_id, `Your offer on "${offer.rows[0].title}" was accepted!`]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Accept error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Decline offer
router.patch('/:id/decline', auth, async (req, res) => {
  console.log('Decline attempt — req.user.id:', req.user.id);
  try {
    const offer = await db.query(
      `SELECT o.*, l.user_id as seller_id, l.title
       FROM offers o LEFT JOIN listings l ON o.listing_id = l.id
       WHERE o.id=$1`,
      [req.params.id]
    );
    if (!offer.rows.length) return res.status(404).json({ error: 'Offer not found' });
    console.log('seller_id from DB:', offer.rows[0].seller_id);
    console.log('Match:', offer.rows[0].seller_id === req.user.id);
    if (offer.rows[0].seller_id !== req.user.id)
      return res.status(403).json({ error: 'Only the seller can decline offers' });
    const result = await db.query(
      `UPDATE offers SET status='declined', updated_at=NOW() WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    await db.query(
      `INSERT INTO notifications (user_id, type, message) VALUES ($1, 'offer_declined', $2)`,
      [offer.rows[0].buyer_id, `Your offer on "${offer.rows[0].title}" was declined.`]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Decline error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Counter offer
router.patch('/:id/counter', auth, async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: 'amount required' });
  try {
    const offer = await db.query(
      `SELECT o.*, l.user_id as seller_id, l.title
       FROM offers o LEFT JOIN listings l ON o.listing_id = l.id
       WHERE o.id=$1`,
      [req.params.id]
    );
    if (!offer.rows.length) return res.status(404).json({ error: 'Offer not found' });
    if (offer.rows[0].seller_id !== req.user.id)
      return res.status(403).json({ error: 'Only the seller can counter offers' });
    const result = await db.query(
      `UPDATE offers SET amount=$1, status='countered', updated_at=NOW() WHERE id=$2 RETURNING *`,
      [amount, req.params.id]
    );
    await db.query(
      `INSERT INTO notifications (user_id, type, message) VALUES ($1, 'offer_countered', $2)`,
      [offer.rows[0].buyer_id, `Seller countered your offer on "${offer.rows[0].title}" with UGX ${Number(amount).toLocaleString()}`]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;