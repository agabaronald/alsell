import { useState, useEffect } from 'react';
import { G } from '../constants';
import { authHeaders, timeAgo } from '../utils';
import { API } from '../constants';

export default function NotificationsModal({ darkMode, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? G.borderDark : G.border;

  useEffect(() => {
    fetch(`${API}/notifications`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      });
    fetch(`${API}/notifications/read`, {
      method: "PATCH",
      headers: authHeaders(),
    });
  }, []);

  const typeIcon = (t) => {
    if (t === "new_offer") return "◎";
    if (t === "offer_accepted") return "✓";
    if (t === "offer_declined") return "×";
    if (t === "offer_countered") return "↺";
    if (t === "new_review") return "★";
    if (t === "price_drop") return "↓";
    if (t === "new_bid") return "⏱";
    if (t === "auction_won") return "🏆";
    if (t === "auction_ended") return "⏱";
    return "•";
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: bg, borderRadius: 18, width: "100%", maxWidth: 440, overflow: "hidden" }}>
        <div style={{ background: G.black, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "DM Sans,sans-serif" }}>Notifications</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          {loading && <div style={{ textAlign: "center", padding: "40px", color: textSecondary, fontFamily: "DM Sans,sans-serif", fontSize: 13 }}>Loading...</div>}
          {!loading && notifications.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 12 }}>🔔</div>
              <div style={{ fontSize: 15, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>No notifications yet</div>
            </div>
          )}
          {notifications.map((n, i) => (
            <div key={n.id} style={{ padding: "14px 20px", borderBottom: i < notifications.length - 1 ? `1px solid ${borderColor}` : "none", display: "flex", gap: 12, alignItems: "flex-start", background: n.read ? "transparent" : darkMode ? "rgba(201,168,76,0.05)" : "rgba(201,168,76,0.04)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: darkMode ? G.goldBgDark : G.goldBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: G.gold, flexShrink: 0 }}>
                {typeIcon(n.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: textPrimary, fontFamily: "DM Sans,sans-serif", lineHeight: 1.5 }}>{n.message}</div>
                <div style={{ fontSize: 11, color: textSecondary, marginTop: 3, fontFamily: "DM Sans,sans-serif" }}>{timeAgo(n.created_at)}</div>
              </div>
              {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: G.gold, flexShrink: 0, marginTop: 5 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
