const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/status', auth, async (req, res) => {
  try {
    const [sellerActivity, buyerActivity] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM listings WHERE user_id=$1', [req.user.id]),
      db.query('SELECT COUNT(*) as count FROM offers WHERE user_id=$1', [req.user.id]),
    ]);
    res.json({
      role: req.user.role,
      has_seller_activity: Number(sellerActivity.rows[0].count) > 0,
      has_buyer_activity: Number(buyerActivity.rows[0].count) > 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
