-- Alsel Database Migration for Supabase
-- Run this in Supabase SQL Editor

-- ── Users ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  username      TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'user',
  is_verified   BOOLEAN DEFAULT false,
  two_fa_enabled BOOLEAN DEFAULT false,
  trust_score   NUMERIC DEFAULT 0,
  rating_avg    NUMERIC DEFAULT 0,
  rating_count  INTEGER DEFAULT 0,
  bio           TEXT,
  phone         TEXT,
  boost_credits INTEGER DEFAULT 0,
  last_login    TIMESTAMP,
  last_ip       TEXT,
  login_count   INTEGER DEFAULT 0,
  banned_until  TIMESTAMP,
  ban_reason    TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── Listings ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listings (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id),
  title         TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC NOT NULL,
  category      TEXT NOT NULL,
  condition     TEXT,
  location      TEXT,
  latitude      NUMERIC,
  longitude     NUMERIC,
  photos        TEXT[] DEFAULT '{}',
  status        TEXT DEFAULT 'active',
  is_auction    BOOLEAN DEFAULT false,
  is_boosted    BOOLEAN DEFAULT false,
  boosted_until TIMESTAMP,
  is_featured   BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP
);

-- ── Offers ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS offers (
  id         SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  buyer_id   INTEGER NOT NULL REFERENCES users(id),
  amount     NUMERIC NOT NULL,
  status     TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- ── Messages ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id        SERIAL PRIMARY KEY,
  offer_id  INTEGER NOT NULL REFERENCES offers(id),
  sender_id INTEGER NOT NULL REFERENCES users(id),
  body      TEXT NOT NULL,
  sent_at   TIMESTAMP DEFAULT NOW()
);

-- ── Favourites ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favourites (
  user_id       INTEGER NOT NULL REFERENCES users(id),
  listing_id    INTEGER NOT NULL REFERENCES listings(id),
  price_at_save NUMERIC NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- ── Notifications ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  type       TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── Reviews ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  reviewer_id INTEGER NOT NULL REFERENCES users(id),
  seller_id   INTEGER NOT NULL REFERENCES users(id),
  listing_id  INTEGER REFERENCES listings(id),
  rating      INTEGER NOT NULL,
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(reviewer_id, listing_id)
);

-- ── Reports ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id              SERIAL PRIMARY KEY,
  reporter_id     INTEGER NOT NULL REFERENCES users(id),
  listing_id      INTEGER REFERENCES listings(id),
  reported_user_id INTEGER REFERENCES users(id),
  reason          TEXT NOT NULL,
  details         TEXT,
  status          TEXT DEFAULT 'pending',
  resolved_by     INTEGER REFERENCES users(id),
  resolved_at     TIMESTAMP,
  resolution_note TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ── Auctions ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auctions (
  id             SERIAL PRIMARY KEY,
  listing_id     INTEGER NOT NULL REFERENCES listings(id) UNIQUE,
  starting_price NUMERIC NOT NULL,
  reserve_price  NUMERIC,
  current_price  NUMERIC NOT NULL,
  ends_at        TIMESTAMP NOT NULL,
  status         TEXT DEFAULT 'active',
  winner_id      INTEGER REFERENCES users(id),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ── Bids ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bids (
  id         SERIAL PRIMARY KEY,
  auction_id INTEGER NOT NULL REFERENCES auctions(id),
  bidder_id  INTEGER NOT NULL REFERENCES users(id),
  amount     NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── Boosts ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS boosts (
  id         SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  user_id    INTEGER NOT NULL REFERENCES users(id),
  active     BOOLEAN DEFAULT true,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── Bundles ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bundles (
  id           SERIAL PRIMARY KEY,
  seller_id    INTEGER NOT NULL REFERENCES users(id),
  title        TEXT NOT NULL,
  description  TEXT,
  bundle_price NUMERIC NOT NULL,
  status       TEXT DEFAULT 'active',
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ── Bundle items ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bundle_items (
  id         SERIAL PRIMARY KEY,
  bundle_id  INTEGER NOT NULL REFERENCES bundles(id),
  listing_id INTEGER NOT NULL REFERENCES listings(id),
  UNIQUE(bundle_id, listing_id)
);

-- ── Two-factor auth ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS two_factor_auth (
  user_id      INTEGER PRIMARY KEY REFERENCES users(id),
  secret       TEXT NOT NULL,
  enabled      BOOLEAN DEFAULT false,
  backup_codes TEXT[],
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ── Device fingerprints ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS device_fingerprints (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  fingerprint TEXT NOT NULL,
  user_agent  TEXT,
  ip_address  TEXT,
  last_seen   TIMESTAMP DEFAULT NOW(),
  trusted     BOOLEAN DEFAULT true,
  UNIQUE(user_id, fingerprint)
);

-- ── Login history ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS login_history (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  ip_address  TEXT,
  fingerprint TEXT,
  status      TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── Trust scores ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trust_scores (
  user_id              INTEGER PRIMARY KEY REFERENCES users(id),
  total_score          NUMERIC DEFAULT 0,
  rating_score         NUMERIC DEFAULT 0,
  verification_score   NUMERIC DEFAULT 0,
  activity_score       NUMERIC DEFAULT 0,
  age_score            NUMERIC DEFAULT 0,
  response_score       NUMERIC DEFAULT 0,
  computed_at          TIMESTAMP DEFAULT NOW()
);

-- ── Admin log ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_log (
  id             SERIAL PRIMARY KEY,
  admin_id       INTEGER NOT NULL REFERENCES users(id),
  action         TEXT NOT NULL,
  target_user_id INTEGER REFERENCES users(id),
  details        TEXT,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_offers_listing_id ON offers(listing_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_messages_offer_id ON messages(offer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_boosts_listing_id ON boosts(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_user_id ON device_fingerprints(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_admin_id ON admin_log(admin_id);

-- ── Seed admin user ──────────────────────────────────────────────
-- Email:    ronnexronnie@gmail.com
-- Password: Phaneroo@12
-- Role:     superadmin
INSERT INTO users (email, username, password_hash, role, is_verified)
VALUES ('ronnexronnie@gmail.com', 'admin', '$2a$10$FMmFDipGAVjmfyDe.Z/Cw.eTOh8RseAD.WNQDuzleSiDQVjTUsyiK', 'superadmin', true)
ON CONFLICT (email) DO NOTHING;
