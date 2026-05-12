const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get auction for a listing
router.get('/listing/:listing_id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*,
        (SELECT COUNT(*) FROM bids WHERE auction_id=a.id) as bid_count,
        (SELECT u.username FROM bids b LEFT JOIN users u ON b.bidder_id=u.id
         WHERE b.auction_id=a.id ORDER BY b.amount DESC LIMIT 1) as top_bidder
       FROM auctions a WHERE a.listing_id=$1`,
      [req.params.listing_id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'No auction found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bids for an auction
router.get('/:auction_id/bids', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.*, u.username as bidder_name
       FROM bids b LEFT JOIN users u ON b.bidder_id=u.id
       WHERE b.auction_id=$1 ORDER BY b.amount DESC`,
      [req.params.auction_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create auction listing
router.post('/', auth, async (req, res) => {
  const { title, description, category, condition, location, latitude, longitude, photos,
          starting_price, reserve_price, duration_hours } = req.body;
  if (!title || !starting_price || !duration_hours)
    return res.status(400).json({ error: 'title, starting_price and duration_hours required' });
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const listing = await client.query(
      `INSERT INTO listings (user_id, title, description, category, condition, location, latitude, longitude, photos, price, status, is_auction)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active',true) RETURNING *`,
      [req.user.id, title, description, category, condition, location, latitude||null, longitude||null, photos||[], starting_price]
    );
    const ends_at = new Date(Date.now() + duration_hours * 60 * 60 * 1000);
    const auction = await client.query(
      `INSERT INTO auctions (listing_id, starting_price, reserve_price, current_price, ends_at)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [listing.rows[0].id, starting_price, reserve_price||null, starting_price, ends_at]
    );
    await client.query('COMMIT');
    res.status(201).json({ listing: listing.rows[0], auction: auction.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Place a bid
router.post('/:auction_id/bid', auth, async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: 'amount required' });
  try {
    const auction = await db.query('SELECT * FROM auctions WHERE id=$1', [req.params.auction_id]);
    if (!auction.rows.length) return res.status(404).json({ error: 'Auction not found' });
    const a = auction.rows[0];
    if (a.status !== 'active') return res.status(400).json({ error: 'Auction is not active' });
    if (new Date() > new Date(a.ends_at)) return res.status(400).json({ error: 'Auction has ended' });
    if (Number(amount) <= Number(a.current_price))
      return res.status(400).json({ error: `Bid must be higher than current price of UGX ${Number(a.current_price).toLocaleString()}` });

    const listing = await db.query('SELECT user_id FROM listings WHERE id=$1', [a.listing_id]);
    if (listing.rows[0].user_id === req.user.id)
      return res.status(400).json({ error: 'Cannot bid on your own listing' });

    await db.query(
      'INSERT INTO bids (auction_id, bidder_id, amount) VALUES ($1,$2,$3)',
      [a.id, req.user.id, amount]
    );
    const updated = await db.query(
      'UPDATE auctions SET current_price=$1 WHERE id=$2 RETURNING *',
      [amount, a.id]
    );
    await db.query('UPDATE listings SET price=$1 WHERE id=$2', [amount, a.listing_id]);

    // Notify seller
    await db.query(
      `INSERT INTO notifications (user_id, type, message) VALUES ($1, 'new_bid', $2)`,
      [listing.rows[0].user_id, `New bid of UGX ${Number(amount).toLocaleString()} on your auction`]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// End auction (called automatically or manually)
router.patch('/:auction_id/end', auth, async (req, res) => {
  try {
    const auction = await db.query('SELECT * FROM auctions WHERE id=$1', [req.params.auction_id]);
    if (!auction.rows.length) return res.status(404).json({ error: 'Not found' });
    const a = auction.rows[0];

    const topBid = await db.query(
      'SELECT * FROM bids WHERE auction_id=$1 ORDER BY amount DESC LIMIT 1',
      [a.id]
    );

    let winner_id = null;
    if (topBid.rows.length && (!a.reserve_price || topBid.rows[0].amount >= a.reserve_price)) {
      winner_id = topBid.rows[0].bidder_id;
      await db.query(
        `INSERT INTO notifications (user_id, type, message) VALUES ($1, 'auction_won', $2)`,
        [winner_id, `You won an auction! Final price: UGX ${Number(topBid.rows[0].amount).toLocaleString()}`]
      );
    }

    const result = await db.query(
      'UPDATE auctions SET status=$1, winner_id=$2 WHERE id=$3 RETURNING *',
      ['ended', winner_id, a.id]
    );
    await db.query('UPDATE listings SET status=$1 WHERE id=$2', [winner_id ? 'sold' : 'active', a.listing_id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;