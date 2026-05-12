const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all bundles
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.*, u.username as seller,
        (SELECT COUNT(*) FROM bundle_items bi WHERE bi.bundle_id=b.id) as item_count,
        (SELECT SUM(l.price) FROM bundle_items bi
         LEFT JOIN listings l ON bi.listing_id=l.id
         WHERE bi.bundle_id=b.id) as original_price
       FROM bundles b
       LEFT JOIN users u ON b.seller_id=u.id
       WHERE b.status='active'
       ORDER BY b.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single bundle with items
router.get('/:id', async (req, res) => {
  try {
    const bundle = await db.query(
      `SELECT b.*, u.username as seller
       FROM bundles b LEFT JOIN users u ON b.seller_id=u.id
       WHERE b.id=$1`,
      [req.params.id]
    );
    if (!bundle.rows.length) return res.status(404).json({ error: 'Bundle not found' });

    const items = await db.query(
      `SELECT l.*, u.username as seller
       FROM bundle_items bi
       LEFT JOIN listings l ON bi.listing_id=l.id
       LEFT JOIN users u ON l.user_id=u.id
       WHERE bi.bundle_id=$1`,
      [req.params.id]
    );

    res.json({ ...bundle.rows[0], items: items.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my listings (for bundle creation)
router.get('/seller/listings', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, title, price, category, condition FROM listings
       WHERE user_id=$1 AND status='active' AND is_auction=false
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create bundle
router.post('/', auth, async (req, res) => {
  const { title, description, bundle_price, listing_ids } = req.body;
  if (!title || !bundle_price || !listing_ids?.length)
    return res.status(400).json({ error: 'title, bundle_price and listing_ids required' });
  if (listing_ids.length < 2)
    return res.status(400).json({ error: 'Bundle must have at least 2 items' });

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Verify all listings belong to this seller
    const check = await client.query(
      `SELECT id FROM listings WHERE id=ANY($1) AND user_id=$2`,
      [listing_ids, req.user.id]
    );
    if (check.rows.length !== listing_ids.length)
      return res.status(403).json({ error: 'All listings must be yours' });

    const bundle = await client.query(
      `INSERT INTO bundles (seller_id, title, description, bundle_price)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.user.id, title, description, bundle_price]
    );

    for (const listing_id of listing_ids) {
      await client.query(
        'INSERT INTO bundle_items (bundle_id, listing_id) VALUES ($1,$2)',
        [bundle.rows[0].id, listing_id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(bundle.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Delete bundle
router.delete('/:id', auth, async (req, res) => {
  try {
    const bundle = await db.query('SELECT seller_id FROM bundles WHERE id=$1', [req.params.id]);
    if (!bundle.rows.length) return res.status(404).json({ error: 'Not found' });
    if (bundle.rows[0].seller_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await db.query('DELETE FROM bundles WHERE id=$1', [req.params.id]);
    res.json({ message: 'Bundle deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
