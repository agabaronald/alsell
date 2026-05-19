import { useState } from 'react';
import { G } from '../constants';
import { authHeaders } from '../utils';
import { API } from '../constants';

export default function ReportModal({ listing, darkMode, onClose }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? G.borderDark : G.border;
  const inputStyle = { width: "100%", background: darkMode ? G.surface2 : G.cream, border: `1px solid ${borderColor}`, borderRadius: 9, padding: "11px 14px", fontSize: 14, color: textPrimary, fontFamily: "DM Sans,sans-serif", outline: "none", boxSizing: "border-box" };
  const reasons = ["Fake listing", "Wrong price", "Scam / fraud", "Inappropriate content", "Already sold", "Other"];

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/reports`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ listing_id: listing.id, reported_user_id: listing.user_id, reason, details }),
      });
      if (res.ok) setSent(true);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: bg, borderRadius: 18, width: "100%", maxWidth: 420, overflow: "hidden" }}>
        <div style={{ background: G.black, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "DM Sans,sans-serif" }}>Report listing</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "24px" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: textPrimary, fontFamily: "DM Sans,sans-serif", marginBottom: 6 }}>Report submitted</div>
              <div style={{ fontSize: 13, color: textSecondary, fontFamily: "DM Sans,sans-serif", marginBottom: 20 }}>We'll review this listing and take action if needed.</div>
              <button onClick={onClose} style={{ background: G.gold, border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, color: G.black, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>Done</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: textSecondary, display: "block", marginBottom: 8, fontFamily: "DM Sans,sans-serif", fontWeight: 500 }}>Reason</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {reasons.map((r) => (
                    <button key={r} onClick={() => setReason(r)}
                      style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${reason === r ? G.gold : borderColor}`, background: reason === r ? (darkMode ? G.goldBgDark : G.goldBg) : "transparent", color: reason === r ? G.gold : textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontWeight: reason === r ? 600 : 400 }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: textSecondary, display: "block", marginBottom: 5, fontFamily: "DM Sans,sans-serif", fontWeight: 500 }}>Additional details (optional)</label>
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Tell us more about the issue..." style={{ ...inputStyle, height: 80, resize: "none" }} />
              </div>
              <button onClick={handleSubmit} disabled={!reason || submitting}
                style={{ background: reason ? G.gold : "#ccc", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, color: G.black, cursor: reason ? "pointer" : "not-allowed", fontFamily: "DM Sans,sans-serif", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Submitting..." : "Submit report"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
