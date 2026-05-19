import { useState, useEffect } from 'react';
import { G } from '../constants';
import { fmt, conditionColor, timeAgo } from '../utils';
import { API } from '../constants';
import { authHeaders } from '../utils';
import ListingPlaceholder from './ListingPlaceholder';
import AuctionBadge from './AuctionBadge';
import EditListingModal from './EditListingModal';
import BoostModal from './BoostModal';
import BidModal from './BidModal';

export default function ListingDetail({ listing, darkMode, onClose, isFaved, onFave, user, onMakeOffer, onAuthRequired, onReport, showToast }) {
  const [showBidModal, setShowBidModal] = useState(false);
  const [auction, setAuction] = useState(null);
  const [offerAmt, setOfferAmt] = useState(Math.round((listing.price * 0.85) / 1000) * 1000);
  const [offerSent, setOfferSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewSent, setReviewSent] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showBoost, setShowBoost] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (listing.is_auction) {
      fetch(`${API}/auctions/listing/${listing.id}`)
        .then(r => r.json())
        .then(data => !data.error && setAuction(data));
    }
  }, [listing.id, listing.is_auction]);
  const cond = conditionColor(listing.condition);
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? G.borderDark : G.border;

  const handleOffer = async () => {
    if (!user) { onAuthRequired(); return; }
    setSending(true);
    try {
      const res = await fetch(`${API}/offers`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ listing_id: listing.id, amount: offerAmt }),
      });
      const data = await res.json();
      if (res.ok) { setOfferSent(true); onMakeOffer?.(data); }
      else alert(data.error || "Failed to send offer");
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: bg, borderRadius: 18, width: "100%", maxWidth: 640, overflow: "hidden", position: "relative" }}>
        <button onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, zIndex: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        <div style={{ height: 280 }}>
          {listing.photos && listing.photos.length > 0 ? (
            <img src={listing.photos[0]} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <ListingPlaceholder id={listing.id} category={listing.category} />
          )}
        </div>
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: darkMode ? G.gold : G.ink, fontFamily: "DM Sans,sans-serif" }}>{fmt(listing.price)}</div>
              <div style={{ fontSize: 17, fontWeight: 500, color: textPrimary, fontFamily: "DM Sans,sans-serif", marginTop: 4 }}>{listing.title}</div>
            </div>
            <button onClick={() => onFave(listing.id)}
              style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: isFaved ? G.gold : "transparent", border: `1.5px solid ${isFaved ? G.gold : borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
              <svg width="16" height="15" viewBox="0 0 12 11" fill="none">
                <path d="M6 10S1 6.5 1 3.5A2.5 2.5 0 0 1 6 2.27 2.5 2.5 0 0 1 11 3.5C11 6.5 6 10 6 10Z" fill={isFaved ? G.black : "none"} stroke={isFaved ? G.black : (darkMode ? G.gold : G.ink2)} strokeWidth="1.3" />
              </svg>
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            {listing.condition && listing.condition !== "N/A" && (
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: darkMode ? "rgba(201,168,76,0.1)" : cond.bg, color: darkMode ? G.goldLight : cond.color }}>{listing.condition}</span>
            )}
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: darkMode ? "rgba(255,255,255,0.05)" : G.cream, color: textSecondary }}>📍 {listing.location}</span>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: darkMode ? "rgba(255,255,255,0.05)" : G.cream, color: textSecondary }}>{timeAgo(listing.created_at)}</span>
          </div>
          <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7, fontFamily: "DM Sans,sans-serif", marginBottom: 20 }}>
            {listing.description || "No description provided."}
          </p>

          {/* Seller row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: darkMode ? G.surface2 : G.cream, borderRadius: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: darkMode ? G.goldBgDark : G.goldBg, border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: G.gold }}>
              {listing.seller ? listing.seller[0].toUpperCase() : "?"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, fontFamily: "DM Sans,sans-serif" }}>{listing.seller || "Seller"}</div>
                {listing.is_verified && (
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "rgba(26,107,26,0.1)", color: G.green }}>✓ Verified</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: G.gold }}>
                {"★".repeat(Math.round(listing.seller_rating || 5))}
                <span style={{ color: textSecondary, marginLeft: 4 }}>{listing.seller_rating ? Number(listing.seller_rating).toFixed(1) : "New seller"}</span>
                {listing.seller_trust_score > 0 && (
                  <span style={{ marginLeft: 8, fontSize: 11, color: textSecondary }}>· Trust {listing.seller_trust_score}/100</span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {user && listing.user_id === user.id && (
                <button onClick={() => setShowEdit(true)}
                  style={{ background: darkMode ? G.goldBgDark : G.goldBg, border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '6px 12px', fontSize: 11, color: G.gold, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: 600 }}>✎ Edit</button>
              )}
              {user && listing.user_id !== user.id && (
                <button onClick={() => onReport?.(listing)}
                  style={{ background: 'transparent', border: `1px solid ${borderColor}`, borderRadius: 8, padding: '6px 12px', fontSize: 11, color: G.ink3, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>Report</button>
              )}
            </div>
          </div>

          {/* Boost button */}
          {user && listing.user_id === user.id && (
            <div style={{ padding: '0 16px 12px' }}>
              <button onClick={() => setShowBoost(true)}
                style={{ width: '100%', background: G.goldBg, border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: G.goldDark, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: 600, textAlign: 'center' }}>⚡ Boost this listing</button>
            </div>
          )}

          {/* Auction / Offer */}
          {listing.is_auction && auction ? (
            <div style={{ marginBottom: 12 }}>
              <div style={{ background: darkMode?G.surface2:G.cream, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>Current bid</div>
                  <AuctionBadge endsAt={auction.ends_at} darkMode={darkMode} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: G.gold, fontFamily: "DM Sans,sans-serif" }}>{fmt(auction.current_price)}</div>
                <div style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif", marginTop: 2 }}>{auction.bid_count || 0} bids · started at {fmt(auction.starting_price)}</div>
              </div>
              <button onClick={() => { if (!user) { onAuthRequired(); return; } setShowBidModal(true); }}
                style={{ width: "100%", background: G.gold, color: G.black, border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>⏱ Place a bid</button>
              {showBidModal && (
                <div style={{ position: "fixed", inset: 0, zIndex: 300, overflowY: "auto" }}>
                  <BidModal listing={listing} auction={auction} darkMode={darkMode} onClose={() => setShowBidModal(false)} user={user}
                    onBidPlaced={(updated) => setAuction(prev => ({...prev, current_price: updated.current_price, bid_count: (prev.bid_count||0)+1}))} />
                </div>
              )}
            </div>
          ) : !listing.is_auction ? (
            !offerSent ? (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif", display: "block", marginBottom: 6 }}>Your offer (UGX)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" value={offerAmt} onChange={(e) => setOfferAmt(Number(e.target.value))}
                    style={{ flex: 1, background: darkMode?G.surface2:G.cream, border: `1px solid ${borderColor}`, borderRadius: 9, padding: "10px 14px", fontSize: 14, color: textPrimary, fontFamily: "DM Sans,sans-serif", outline: "none" }} />
                  <button onClick={handleOffer} disabled={sending}
                    style={{ background: G.gold, color: G.black, border: "none", borderRadius: 9, padding: "0 22px", fontSize: 14, fontWeight: 700, cursor: sending?"not-allowed":"pointer", fontFamily: "DM Sans,sans-serif", flexShrink: 0, opacity: sending?0.7:1 }}>
                    {sending ? "Sending..." : "Make offer"}
                  </button>
                </div>
                <div style={{ fontSize: 11, color: textSecondary, marginTop: 5, fontFamily: "DM Sans,sans-serif" }}>Suggested: {fmt(Math.round(listing.price * 0.85 / 1000) * 1000)} (15% below asking)</div>
              </div>
            ) : (
              <div style={{ background: darkMode?"rgba(201,168,76,0.08)":G.goldBg, border: "1px solid rgba(201,168,76,0.3)", borderRadius: 10, padding: "14px 16px", marginBottom: 12, textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: G.gold, fontFamily: "DM Sans,sans-serif" }}>Offer sent — {fmt(offerAmt)}</div>
                <div style={{ fontSize: 12, color: textSecondary, marginTop: 3 }}>Check your offers inbox for updates</div>
              </div>
            )
          ) : null}

          {/* Leave a review */}
          {user && listing.user_id !== user.id && (
            <div style={{ marginTop: 12 }}>
              {!showReview ? (
                <button onClick={() => setShowReview(true)}
                  style={{ width: "100%", background: "transparent", border: `1.5px solid ${borderColor}`, borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, color: textSecondary, cursor: "pointer", fontFamily: "DM Sans,sans-serif", marginTop: 8 }}>★ Leave a review</button>
              ) : reviewSent ? (
                <div style={{ background: darkMode ? "rgba(26,107,26,0.1)" : G.greenBg, border: "1px solid rgba(26,107,26,0.3)", borderRadius: 10, padding: "14px 16px", textAlign: "center", marginTop: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: G.green, fontFamily: "DM Sans,sans-serif" }}>Review submitted — thank you!</div>
                </div>
              ) : (
                <div style={{ background: darkMode ? G.surface2 : G.cream, borderRadius: 12, padding: "16px", marginTop: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, fontFamily: "DM Sans,sans-serif", marginBottom: 12 }}>Rate this seller</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}
                        style={{ fontSize: 22, background: "none", border: "none", cursor: "pointer", color: s <= reviewForm.rating ? G.gold : (darkMode ? "rgba(255,255,255,0.15)" : "#DDD"), transition: "color 0.15s" }}>★</button>
                    ))}
                  </div>
                  <textarea value={reviewForm.comment} onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with this seller..."
                    style={{ width: "100%", background: darkMode ? G.surface : G.cream, border: `1px solid ${borderColor}`, borderRadius: 9, padding: "10px 14px", fontSize: 13, color: textPrimary, fontFamily: "DM Sans,sans-serif", outline: "none", resize: "none", height: 80, boxSizing: "border-box" }} />
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button onClick={() => setShowReview(false)}
                      style={{ flex: 1, background: "transparent", border: `1px solid ${borderColor}`, borderRadius: 9, padding: "10px", fontSize: 13, color: textSecondary, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>Cancel</button>
                    <button onClick={async () => {
                      setSubmittingReview(true);
                      try {
                        const res = await fetch(`${API}/reviews`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ seller_id: listing.user_id, listing_id: listing.id, rating: reviewForm.rating, comment: reviewForm.comment }) });
                        if (res.ok) setReviewSent(true);
                        else { const d = await res.json(); alert(d.error || "Failed to submit review"); }
                      } catch (err) { console.error(err); }
                      finally { setSubmittingReview(false); }
                    }} disabled={submittingReview}
                      style={{ flex: 2, background: G.gold, border: "none", borderRadius: 9, padding: "10px", fontSize: 13, fontWeight: 700, color: G.black, cursor: submittingReview ? "not-allowed" : "pointer", fontFamily: "DM Sans,sans-serif", opacity: submittingReview ? 0.7 : 1 }}>
                      {submittingReview ? "Submitting..." : "Submit review"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showEdit && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, overflowY: "auto" }}>
          <EditListingModal listing={listing} darkMode={darkMode} onClose={() => setShowEdit(false)} onSaved={() => { onClose(); showToast('Listing updated!'); }} showToast={showToast} />
        </div>
      )}
      {showBoost && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, overflowY: "auto" }}>
          <BoostModal listing={listing} darkMode={darkMode} onClose={() => setShowBoost(false)} onBoosted={() => setShowBoost(false)} showToast={showToast} />
        </div>
      )}
    </div>
  );
}
