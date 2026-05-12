const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get boost status for a listing
router.get('/listing/:listing_id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM boosts WHERE listing_id=$1 AND active=true AND expires_at > NOW()`,
      [req.params.listing_id]
    );
    res.json({ boosted: result.rows.length > 0, boost: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's boost credits
router.get('/credits', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT boost_credits FROM users WHERE id=$1',
      [req.user.id]
    );
    res.json({ credits: result.rows[0]?.boost_credits || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Boost a listing
router.post('/listing/:listing_id', auth, async (req, res) => {
  const { duration_hours = 24 } = req.body;
  try {
    // Check listing belongs to user
    const listing = await db.query(
      'SELECT * FROM listings WHERE id=$1 AND user_id=$2',
      [req.params.listing_id, req.user.id]
    );
    if (!listing.rows.length)
      return res.status(403).json({ error: 'Listing not found or not yours' });

    // Check already boosted
    const existing = await db.query(
      'SELECT * FROM boosts WHERE listing_id=$1 AND active=true AND expires_at > NOW()',
      [req.params.listing_id]
    );
    if (existing.rows.length)
      return res.status(400).json({ error: 'Listing is already boosted' });

    // Check credits
    const user = await db.query(
      'SELECT boost_credits FROM users WHERE id=$1',
      [req.user.id]
    );
    if (user.rows[0].boost_credits < 1)
      return res.status(400).json({ error: 'No boost credits remaining' });

    const expires_at = new Date(Date.now() + duration_hours * 60 * 60 * 1000);

    // Deduct credit and create boost
    await db.query(
      'UPDATE users SET boost_credits=boost_credits-1 WHERE id=$1',
      [req.user.id]
    );
    await db.query(
      'UPDATE listings SET is_boosted=true, boosted_until=$1 WHERE id=$2',
      [expires_at, req.params.listing_id]
    );
    const boost = await db.query(
      `INSERT INTO boosts (listing_id, user_id, expires_at)
       VALUES ($1,$2,$3) RETURNING *`,
      [req.params.listing_id, req.user.id, expires_at]
    );

    res.json({ boost: boost.rows[0], credits_remaining: user.rows[0].boost_credits - 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove expired boosts (called by cron)
router.post('/cleanup', async (req, res) => {
  try {
    const expired = await db.query(
      'UPDATE boosts SET active=false WHERE expires_at < NOW() AND active=true RETURNING listing_id'
    );
    for (const row of expired.rows) {
      await db.query(
        'UPDATE listings SET is_boosted=false, boosted_until=NULL WHERE id=$1',
        [row.listing_id]
      );
    }
    res.json({ cleaned: expired.rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;