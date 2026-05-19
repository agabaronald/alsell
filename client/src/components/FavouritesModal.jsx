import { useState, useEffect } from 'react';
import { G } from '../constants';
import { fmt, authHeaders } from '../utils';
import { API } from '../constants';
import ListingPlaceholder from './ListingPlaceholder';

export default function FavouritesModal({ darkMode, onClose, onOpen }) {
  const [favListings, setFavListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;

  useEffect(() => {
    fetch(`${API}/favourites`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        setFavListings(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: bg, borderRadius: 18, width: "100%", maxWidth: 560, overflow: "hidden" }}>
        <div style={{ background: G.black, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "DM Sans,sans-serif" }}>Saved listings</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "16px", maxHeight: 520, overflowY: "auto" }}>
          {loading && <div style={{ textAlign: "center", padding: "40px", color: textSecondary, fontFamily: "DM Sans,sans-serif", fontSize: 13 }}>Loading...</div>}
          {!loading && favListings.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 12 }}>♡</div>
              <div style={{ fontSize: 15, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>No saved listings yet</div>
              <div style={{ fontSize: 13, color: G.ink3, marginTop: 4 }}>Tap the heart on any listing to save it</div>
            </div>
          )}
          {favListings.map((l) => {
            const dropped = l.price_at_save && Number(l.price) < Number(l.price_at_save);
            const dropPct = dropped ? Math.round(((l.price_at_save - l.price) / l.price_at_save) * 100) : 0;
            return (
              <div key={l.id} onClick={() => { onClose(); onOpen(l); }}
                style={{ display: "flex", gap: 12, padding: "12px", borderRadius: 12, marginBottom: 8, background: darkMode?G.surface2:G.cream, cursor: "pointer", border: dropped?`1px solid rgba(26,107,26,0.3)`:"1px solid transparent" }}>
                <div style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                  {l.photos?.[0] ? <img src={l.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <ListingPlaceholder id={l.id} category={l.category} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: darkMode?G.gold:G.ink, fontFamily: "DM Sans,sans-serif" }}>{fmt(l.price)}</div>
                    {dropped && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: G.greenBg, color: G.green, fontFamily: "DM Sans,sans-serif" }}>
                        ↓ {dropPct}% drop
                      </span>
                    )}
                  </div>
                  {dropped && (
                    <div style={{ fontSize: 11, color: G.ink3, fontFamily: "DM Sans,sans-serif", textDecoration: "line-through", marginBottom: 2 }}>
                      was {fmt(l.price_at_save)}
                    </div>
                  )}
                  <div style={{ fontSize: 13, color: textPrimary, fontFamily: "DM Sans,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                  <div style={{ fontSize: 11, color: textSecondary, fontFamily: "DM Sans,sans-serif", marginTop: 2 }}>📍 {l.location} · {l.seller}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
