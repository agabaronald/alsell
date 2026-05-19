import { useState, useEffect } from 'react';
import { G } from '../constants';
import { fmt, authHeaders, timeAgo } from '../utils';
import { API } from '../constants';

export default function OffersModal({ darkMode, onClose, user, onOpenChat, showToast }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? G.borderDark : G.border;


  const loadOffers = async () => {
    try {
      const res = await fetch(`${API}/offers/mine`, { headers: authHeaders() });
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadOffers(); }, []);

  const handleAction = async (id, action, amount) => {
    try {
      const body = action === "counter" ? JSON.stringify({ amount }) : JSON.stringify({});
      const res = await fetch(`${API}/offers/${id}/${action}`, { method: "PATCH", headers: authHeaders(), body });
      const data = await res.json();
      if (res.ok) await loadOffers();
      else showToast(data.error || "Action failed");
    } catch (err) { console.error(err); }
  };

  const statusColor = (s) => {
    if (s === "accepted") return { bg: G.greenBg, color: G.green };
    if (s === "declined") return { bg: G.redBg, color: G.red };
    if (s === "countered") return { bg: G.goldBg, color: G.goldDark };
    return { bg: darkMode ? "rgba(255,255,255,0.05)" : "#F5F5F5", color: G.ink3 };
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: bg, borderRadius: 18, width: "100%", maxWidth: 560, overflow: "hidden" }}>
        <div style={{ background: G.black, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "DM Sans,sans-serif" }}>Offers inbox</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "16px", maxHeight: 520, overflowY: "auto" }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "40px", color: textSecondary, fontFamily: "DM Sans,sans-serif", fontSize: 13 }}>Loading...</div>
          )}
          {!loading && offers.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 12 }}>◎</div>
              <div style={{ fontSize: 15, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>No offers yet</div>
            </div>
          )}
          {offers.map((o) => {
            const sc = statusColor(o.status);
            const isSeller = o.seller_id === user?.id;
            return (
              <div key={o.id} style={{ background: darkMode ? G.surface2 : G.cream, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, fontFamily: "DM Sans,sans-serif", flex: 1, paddingRight: 8 }}>{o.listing_title}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: sc.bg, color: sc.color, whiteSpace: "nowrap" }}>{o.status}</span>
                </div>
                <div style={{ fontSize: 13, color: G.gold, fontWeight: 600, fontFamily: "DM Sans,sans-serif", marginBottom: 4 }}>{fmt(o.amount)}</div>
                <div style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif", marginBottom: 10 }}>
                  {isSeller ? `Buyer: ${o.buyer_name}` : `Asking: ${fmt(o.listing_price)}`} · {timeAgo(o.created_at)}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => onOpenChat(o)}
                    style={{ background: "transparent", border: `1px solid ${borderColor}`, borderRadius: 8, padding: "6px 14px", fontSize: 12, color: textSecondary, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>💬 Chat</button>
                  {isSeller && o.status === "pending" && (
                    <>
                      <button onClick={() => handleAction(o.id, "accept")}
                        style={{ background: G.greenBg, border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: G.green, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>Accept</button>
                      <button onClick={() => handleAction(o.id, "decline")}
                        style={{ background: G.redBg, border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: G.red, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>Decline</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
