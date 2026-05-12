const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get user's favourites
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT l.*, u.username as seller,
              a.id as auction_id, a.current_price as auction_current_price,
              a.starting_price as auction_starting_price, a.ends_at as auction_ends_at,
              a.status as auction_status,
              (SELECT COUNT(*) FROM bids b WHERE b.auction_id=a.id) as bid_count
       FROM favourites f
       LEFT JOIN listings l ON f.listing_id = l.id
       LEFT JOIN users u ON l.user_id = u.id
       LEFT JOIN auctions a ON l.id = a.listing_id
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
    await db.query(
      `INSERT INTO favourites (user_id, listing_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.user.id, listing_id]
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