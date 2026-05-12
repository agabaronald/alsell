const db = require('../db');

const endExpiredAuctions = async () => {
  try {
    const expired = await db.query(
      `SELECT a.*, l.user_id as seller_id FROM auctions a
       LEFT JOIN listings l ON a.listing_id = l.id
       WHERE a.status='active' AND a.ends_at < NOW()`
    );

    for (const auction of expired.rows) {
      const topBid = await db.query(
        'SELECT * FROM bids WHERE auction_id=$1 ORDER BY amount DESC LIMIT 1',
        [auction.id]
      );

      let winner_id = null;
      if (topBid.rows.length && (!auction.reserve_price || topBid.rows[0].amount >= auction.reserve_price)) {
        winner_id = topBid.rows[0].bidder_id;
        await db.query(
          `INSERT INTO notifications (user_id, type, message) VALUES ($1, 'auction_won', $2)`,
          [winner_id, `You won an auction! Final price: UGX ${Number(topBid.rows[0].amount).toLocaleString()}`]
        );
        await db.query(
          `INSERT INTO notifications (user_id, type, message) VALUES ($1, 'auction_ended', $2)`,
          [auction.seller_id, `Your auction ended. Winning bid: UGX ${Number(topBid.rows[0].amount).toLocaleString()}`]
        );
      }

      await db.query(
        'UPDATE auctions SET status=$1, winner_id=$2 WHERE id=$3',
        ['ended', winner_id, auction.id]
      );
      await db.query(
        'UPDATE listings SET status=$1 WHERE id=$2',
        [winner_id ? 'sold' : 'active', auction.listing_id]
      );

      console.log(`Auction ${auction.id} ended. Winner: ${winner_id || 'none'}`);
    }
  } catch (err) {
    console.error('End auctions job error:', err.message);
  }
};

module.exports = endExpiredAuctions;