import { useState } from 'react';
import { G } from '../constants';
import { API } from '../constants';

export default function AuthModal({ darkMode, onClose, onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : G.border;
  const inputStyle = { width: "100%", background: darkMode ? G.surface2 : G.cream, border: `1px solid ${borderColor}`, borderRadius: 9, padding: "11px 14px", fontSize: 14, color: textPrimary, fontFamily: "DM Sans,sans-serif", outline: "none", boxSizing: "border-box" };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login" ? { email: form.email, password: form.password } : { email: form.email, username: form.username, password: form.password };
      const res = await fetch(`${API}${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      localStorage.setItem("alsel_token", data.token);
      localStorage.setItem("alsel_user", JSON.stringify(data.user));
      onAuth(data.user);
      onClose();
    } catch { setError("Network error — please try again"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: bg, borderRadius: 18, width: "100%", maxWidth: 420, overflow: "hidden" }}>
        <div style={{ background: G.black, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: G.gold, fontFamily: "DM Sans,sans-serif", letterSpacing: -0.5 }}>al<span style={{ color: "#fff" }}>sel</span></div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ display: "flex", borderBottom: `1px solid ${borderColor}` }}>
          {["login", "register"].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex: 1, padding: "14px", background: "transparent", border: "none", borderBottom: mode === m ? `2px solid ${G.gold}` : "2px solid transparent", fontSize: 14, fontWeight: mode === m ? 600 : 400, color: mode === m ? G.gold : textSecondary, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>
              {m === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <button onClick={() => (window.location.href = `${API.replace("/api", "")}/api/auth/google`)}
            style={{ width: "100%", background: "#fff", border: "1.5px solid #DADCE0", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#3C4043" }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: darkMode ? "rgba(255,255,255,0.08)" : G.border }} />
            <span style={{ fontSize: 12, color: G.ink3, fontFamily: "DM Sans,sans-serif" }}>or</span>
            <div style={{ flex: 1, height: 1, background: darkMode ? "rgba(255,255,255,0.08)" : G.border }} />
          </div>
          {mode === "register" && (
            <div>
              <label style={{ fontSize: 12, color: textSecondary, display: "block", marginBottom: 5, fontFamily: "DM Sans,sans-serif", fontWeight: 500 }}>Username</label>
              <input style={inputStyle} placeholder="e.g. johndoe" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, color: textSecondary, display: "block", marginBottom: 5, fontFamily: "DM Sans,sans-serif", fontWeight: 500 }}>Email</label>
            <input style={inputStyle} type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: textSecondary, display: "block", marginBottom: 5, fontFamily: "DM Sans,sans-serif", fontWeight: 500 }}>Password</label>
            <input style={inputStyle} type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
          {error && <div style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#E05050", fontFamily: "DM Sans,sans-serif" }}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading}
            style={{ background: G.gold, color: G.black, border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "DM Sans,sans-serif", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </div>
      </div>
    </div>
  );
}
