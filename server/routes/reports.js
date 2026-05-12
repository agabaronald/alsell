const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Submit a report
router.post('/', auth, async (req, res) => {
  const { listing_id, reported_user_id, reason, details } = req.body;
  if (!reason)
    return res.status(400).json({ error: 'reason required' });
  try {
    const result = await db.query(
      `INSERT INTO reports (reporter_id, listing_id, reported_user_id, reason, details)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.id, listing_id, reported_user_id, reason, details]
    );
    res.status(201).json({ message: 'Report submitted', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;