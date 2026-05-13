const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get user's favourites
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT l.*, u.username as seller, f.price_at_save
       FROM favourites f
       LEFT JOIN listings l ON f.listing_id = l.id
       LEFT JOIN users u ON l.user_id = u.id
       WHERE f.user_id=$1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to favourites
router.post('/', auth, async (req, res) => {
  const { listing_id } = req.body;
  if (!listing_id) return res.status(400).json({ error: 'listing_id required' });
  try {
    const listing = await db.query('SELECT price FROM listings WHERE id=$1', [listing_id]);
    if (!listing.rows.length) return res.status(404).json({ error: 'Listing not found' });
    const price_at_save = listing.rows[0].price;
    await db.query(
      `INSERT INTO favourites (user_id, listing_id, price_at_save)
       VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
      [req.user.id, listing_id, price_at_save]
    );
    res.status(201).json({ message: 'Added to favourites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from favourites
router.delete('/:listing_id', auth, async (req, res) => {
  try {
    await db.query(
      `DELETE FROM favourites WHERE user_id=$1 AND listing_id=$2`,
      [req.user.id, req.params.listing_id]
    );
    res.json({ message: 'Removed from favourites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;