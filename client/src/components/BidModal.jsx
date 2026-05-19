import { useState, useEffect } from 'react';
import { G } from '../constants';
import { fmt, authHeaders, timeAgo } from '../utils';
import { API } from '../constants';

export default function BidModal({ listing, auction, darkMode, onClose, user, onBidPlaced }) {
  const [bids, setBids] = useState([]);
  const [amount, setAmount] = useState(Number(auction.current_price) + 50000);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? G.borderDark : G.border;

  useEffect(() => {
    fetch(`${API}/auctions/${auction.id}/bids`, { headers: authHeaders() })
      .then(r => r.json()).then(data => Array.isArray(data) && setBids(data));
    const calc = () => {
      const diff = new Date(auction.ends_at) - Date.now();
      if (diff <= 0) { setTimeLeft("Ended"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`);
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [auction.id, auction.ends_at]);

  const placeBid = async () => {
    setError(""); setSubmitting(true);
    try {
      const res = await fetch(`${API}/auctions/${auction.id}/bid`, {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok) {
        setBids(prev => [{ id: Date.now(), bidder_name: user.username, amount, created_at: new Date() }, ...prev]);
        setAmount(amount + 50000);
        onBidPlaced && onBidPlaced(data);
      } else setError(data.error || "Failed to place bid");
    } catch { setError("Network error"); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: bg, borderRadius: 18, width: "100%", maxWidth: 520, overflow: "hidden" }}>
        <div style={{ background: G.black, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "DM Sans,sans-serif" }}>{listing.title}</div>
            <div style={{ fontSize: 12, color: G.gold, fontFamily: "DM Sans,sans-serif" }}>⏱ {timeLeft} remaining</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ background: darkMode?G.surface2:G.cream, borderRadius: 12, padding: "16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>Current bid</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: G.gold, fontFamily: "DM Sans,sans-serif" }}>{fmt(auction.current_price)}</div>
              <div style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>{auction.bid_count || bids.length} bid{(auction.bid_count || bids.length) !== 1 ? "s" : ""}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>Starting price</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: textPrimary, fontFamily: "DM Sans,sans-serif" }}>{fmt(auction.starting_price)}</div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif", display: "block", marginBottom: 6, fontWeight: 500 }}>Your bid (UGX)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                style={{ flex: 1, background: darkMode?G.surface2:G.cream, border: `1px solid ${borderColor}`, borderRadius: 9, padding: "11px 14px", fontSize: 15, color: textPrimary, fontFamily: "DM Sans,sans-serif", outline: "none", fontWeight: 600 }} />
              <button onClick={placeBid} disabled={submitting}
                style={{ background: G.gold, color: G.black, border: "none", borderRadius: 9, padding: "0 22px", fontSize: 14, fontWeight: 700, cursor: submitting?"not-allowed":"pointer", fontFamily: "DM Sans,sans-serif", opacity: submitting?0.7:1 }}>
                {submitting ? "..." : "Bid"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {[50000, 100000, 200000].map(inc => (
                <button key={inc} onClick={() => setAmount(Number(auction.current_price) + inc)}
                  style={{ flex: 1, background: "transparent", border: `1px solid ${borderColor}`, borderRadius: 8, padding: "6px", fontSize: 11, color: textSecondary, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>
                  +{fmt(inc).replace("UGX ","")}
                </button>
              ))}
            </div>
            {error && <div style={{ marginTop: 8, fontSize: 13, color: G.red, fontFamily: "DM Sans,sans-serif" }}>{error}</div>}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: textSecondary, fontFamily: "DM Sans,sans-serif", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Bid history</div>
            {bids.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: textSecondary, fontSize: 13, fontFamily: "DM Sans,sans-serif" }}>No bids yet — be the first!</div>
            ) : (
              <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                {bids.map((b, i) => (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: i===0?(darkMode?"rgba(201,168,76,0.08)":G.goldBg):( darkMode?G.surface2:G.cream), borderRadius: 8, border: i===0?`1px solid rgba(201,168,76,0.2)`:"none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {i===0 && <span style={{ fontSize: 10, fontWeight: 700, color: G.gold }}>👑</span>}
                      <span style={{ fontSize: 13, color: textPrimary, fontFamily: "DM Sans,sans-serif", fontWeight: i===0?600:400 }}>{b.bidder_name}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: i===0?G.gold:textPrimary, fontFamily: "DM Sans,sans-serif" }}>{fmt(b.amount)}</div>
                      <div style={{ fontSize: 10, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>{timeAgo(b.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
