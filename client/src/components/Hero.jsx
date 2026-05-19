import { G, TRENDING } from '../constants';

export default function Hero({ onSearch, searchQuery, setSearchQuery }) {
  return (
    <div style={{ background: G.black, padding: "52px 20px 48px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, opacity: 0.04, pointerEvents: "none" }}>
        <svg width="300" height="300" viewBox="0 0 300 300">
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx="300" cy="0" r={80 + i * 40} fill="none" stroke={G.gold} strokeWidth="1" />
          ))}
        </svg>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: "rgba(201,168,76,0.15)", color: G.gold, marginBottom: 16, letterSpacing: 0.5 }}>Uganda's #1 marketplace</div>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontFamily: "'Clash Display','DM Sans',sans-serif", fontWeight: 700, color: "#fff", margin: "0 0 8px", letterSpacing: -1.5, lineHeight: 1.1 }}>
          Buy &amp; sell<br /><span style={{ color: G.gold }}>anything.</span>
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "0 0 28px", fontFamily: "DM Sans,sans-serif" }}>Thousands of listings near you, updated daily.</p>
        <div style={{ maxWidth: 560, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(201,168,76,0.3)", borderRadius: 12, padding: "0 6px 0 16px", height: 52, gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <path d="M9 9L13 13" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Search for phones, cars, furniture..."
            style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: "#fff", outline: "none", fontFamily: "DM Sans,sans-serif" }} />
          <button onClick={onSearch}
            style={{ background: G.gold, color: G.black, border: "none", borderRadius: 9, padding: "0 20px", height: 40, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans,sans-serif", flexShrink: 0 }}>Search</button>
        </div>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "DM Sans,sans-serif" }}>Trending:</span>
          {TRENDING.map((t) => (
            <button key={t} onClick={() => { setSearchQuery(t); onSearch(t); }}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "DM Sans,sans-serif", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.background = "rgba(201,168,76,0.15)"; e.target.style.borderColor = "rgba(201,168,76,0.4)"; e.target.style.color = G.gold; }}
              onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.6)"; }}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
