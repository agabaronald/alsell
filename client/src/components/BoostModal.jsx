import { useState, useEffect } from 'react';
import { G } from '../constants';
import { fmt, authHeaders } from '../utils';
import { API } from '../constants';

export default function BoostModal({ listing, darkMode, onClose, onBoosted, showToast }) {
  const [credits, setCredits] = useState(null);
  const [duration, setDuration] = useState(24);
  const [boosting, setBoosting] = useState(false);
  const [boosted, setBoosted] = useState(false);
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? G.borderDark : G.border;

  useEffect(() => {
    fetch(`${API}/boosts/credits`, { headers: authHeaders() })
      .then(r => r.json()).then(data => setCredits(data.credits));
  }, []);

  const handleBoost = async () => {
    setBoosting(true);
    try {
      const res = await fetch(`${API}/boosts/listing/${listing.id}`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ duration_hours: duration }),
      });
      const data = await res.json();
      if (res.ok) {
        setBoosted(true);
        setCredits(data.credits_remaining);
        onBoosted && onBoosted();
        showToast('Listing boosted!');
      } else showToast(data.error || 'Failed to boost');
    } catch { showToast('Network error'); }
    finally { setBoosting(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: bg, borderRadius: 18, width: "100%", maxWidth: 420, overflow: "hidden" }}>
        <div style={{ background: G.black, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "DM Sans,sans-serif" }}>⚡ Boost listing</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "24px" }}>
          {boosted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: textPrimary, fontFamily: "DM Sans,sans-serif", marginBottom: 6 }}>Listing boosted!</div>
              <div style={{ fontSize: 13, color: textSecondary, fontFamily: "DM Sans,sans-serif", marginBottom: 20 }}>Your listing will appear at the top of search results for {duration} hours.</div>
              <button onClick={onClose} style={{ background: G.gold, border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, color: G.black, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>Done</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: darkMode?G.surface2:G.cream, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, fontFamily: "DM Sans,sans-serif" }}>{listing.title}</div>
                <div style={{ fontSize: 12, color: G.gold, fontFamily: "DM Sans,sans-serif", marginTop: 2 }}>{fmt(listing.price)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: darkMode?"rgba(201,168,76,0.08)":G.goldBg, border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, fontFamily: "DM Sans,sans-serif" }}>Boost credits</div>
                  <div style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>Each boost uses 1 credit</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: G.gold, fontFamily: "DM Sans,sans-serif" }}>{credits ?? "..."}</div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif", display: "block", marginBottom: 8, fontWeight: 500 }}>Boost duration</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[6, 24, 48, 72].map(h => (
                    <button key={h} onClick={() => setDuration(h)}
                      style={{ flex: 1, padding: "8px 4px", borderRadius: 9, border: `1px solid ${duration===h?G.gold:borderColor}`, background: duration===h?(darkMode?G.goldBgDark:G.goldBg):"transparent", color: duration===h?G.gold:textSecondary, fontSize: 12, fontWeight: duration===h?700:400, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Appears at top of all listings", "Gold ⚡ Boosted badge on card", "More visibility to buyers", "Higher chance of a quick sale"].map(benefit => (
                  <div key={benefit} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>
                    <span style={{ color: G.gold, fontSize: 11 }}>✓</span>{benefit}
                  </div>
                ))}
              </div>
              <button onClick={handleBoost} disabled={boosting || credits === 0}
                style={{ background: credits === 0 ? "#ccc" : G.gold, border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, color: G.black, cursor: credits===0?"not-allowed":"pointer", fontFamily: "DM Sans,sans-serif", opacity: boosting?0.7:1 }}>
                {boosting ? "Boosting..." : credits === 0 ? "No credits remaining" : `⚡ Boost for ${duration}h — 1 credit`}
              </button>
              {credits === 0 && (
                <div style={{ fontSize: 12, color: textSecondary, textAlign: "center", fontFamily: "DM Sans,sans-serif" }}>
                  You've used all your free credits. More credits coming in Phase 5 with payments.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
