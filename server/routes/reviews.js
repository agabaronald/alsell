const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get reviews for a seller
router.get('/seller/:seller_id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, u.username as reviewer_name
       FROM reviews r
       LEFT JOIN users u ON r.reviewer_id = u.id
       WHERE r.seller_id=$1
       ORDER BY r.created_at DESC`,
      [req.params.seller_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leave a review
router.post('/', auth, async (req, res) => {
  const { seller_id, listing_id, rating, comment } = req.body;
  if (!seller_id || !rating)
    return res.status(400).json({ error: 'seller_id and rating required' });
  if (seller_id === req.user.id)
    return res.status(400).json({ error: 'Cannot review yourself' });
  try {
    const result = await db.query(
      `INSERT INTO reviews (reviewer_id, seller_id, listing_id, rating, comment)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.id, seller_id, listing_id, rating, comment]
    );

    // Update seller average rating
    await db.query(
      `UPDATE users SET
        rating_avg = (SELECT AVG(rating) FROM reviews WHERE seller_id=$1),
        rating_count = (SELECT COUNT(*) FROM reviews WHERE seller_id=$1)
       WHERE id=$1`,
      [seller_id]
    );

    // Notify seller
    await db.query(
      `INSERT INTO notifications (user_id, type, message) VALUES ($1, 'new_review', $2)`,
      [seller_id, `You received a ${rating}-star review!`]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ error: 'You have already reviewed this listing' });
    res.status(500).json({ error: err.message });
  }
});

// Get seller profile with stats
router.get('/profile/:user_id', async (req, res) => {
  try {
    const user = await db.query(
      `SELECT id, username, avatar_url, bio, is_verified, rating_avg, rating_count, created_at
       FROM users WHERE id=$1`,
      [req.params.user_id]
    );
    if (!user.rows.length) return res.status(404).json({ error: 'User not found' });

    const listings = await db.query(
      `SELECT id, title, price, condition, location, category, created_at
       FROM listings WHERE user_id=$1 AND status='active'
       ORDER BY created_at DESC`,
      [req.params.user_id]
    );

    const reviews = await db.query(
      `SELECT r.*, u.username as reviewer_name
       FROM reviews r LEFT JOIN users u ON r.reviewer_id = u.id
       WHERE r.seller_id=$1 ORDER BY r.created_at DESC LIMIT 10`,
      [req.params.user_id]
    );

    res.json({
      user: user.rows[0],
      listings: listings.rows,
      reviews: reviews.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;