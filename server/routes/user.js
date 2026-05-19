const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/status', auth, async (req, res) => {
  try {
    const [userRow, sellerActivity, buyerActivity] = await Promise.all([
      db.query('SELECT role FROM users WHERE id=$1', [req.user.id]),
      db.query('SELECT COUNT(*) as count FROM listings WHERE user_id=$1', [req.user.id]),
      db.query('SELECT COUNT(*) as count FROM offers WHERE user_id=$1', [req.user.id]),
    ]);
    if (!userRow.rows.length) return res.status(401).json({ error: 'User not found' });
    res.json({
      role: userRow.rows[0].role,
      has_seller_activity: Number(sellerActivity.rows[0].count) > 0,
      has_buyer_activity: Number(buyerActivity.rows[0].count) > 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
