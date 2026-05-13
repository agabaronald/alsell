const db = require('../db');

const checkPriceDrops = async () => {
  try {
    // Find favourites where current price is lower than price at save
    const drops = await db.query(
      `SELECT f.user_id, f.listing_id, f.price_at_save,
              l.price as current_price, l.title
       FROM favourites f
       LEFT JOIN listings l ON f.listing_id = l.id
       WHERE l.price < f.price_at_save
       AND l.status = 'active'`
    );

    for (const drop of drops.rows) {
      const saved = Number(drop.price_at_save);
      const current = Number(drop.current_price);
      const pct = Math.round(((saved - current) / saved) * 100);

      // Only notify for drops of 5% or more
      if (pct < 5) continue;

      // Check we haven't already notified for this price
      const existing = await db.query(
        `SELECT id FROM notifications
         WHERE user_id=$1 AND type='price_drop'
         AND message LIKE $2
         AND created_at > NOW() - INTERVAL '24 hours'`,
        [drop.user_id, `%${drop.title}%`]
      );
      if (existing.rows.length) continue;

      // Send notification
      await db.query(
        `INSERT INTO notifications (user_id, type, message)
         VALUES ($1, 'price_drop', $2)`,
        [drop.user_id, `Price drop! "${drop.title}" dropped ${pct}% — now UGX ${current.toLocaleString()} (was UGX ${saved.toLocaleString()})`]
      );

      // Update the saved price so we don't notify again for same price
      await db.query(
        `UPDATE favourites SET price_at_save=$1
         WHERE user_id=$2 AND listing_id=$3`,
        [current, drop.user_id, drop.listing_id]
      );

      console.log(`Price drop alert sent to user ${drop.user_id} for ${drop.title}`);
    }
  } catch (err) {
    console.error('Price drop check error:', err.message);
  }
};

module.exports = checkPriceDrops;