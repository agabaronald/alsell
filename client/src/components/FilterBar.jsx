import { G } from '../constants';

export default function FilterBar({ sort, setSort, condition, setCondition, darkMode, count, nearMe, onNearMe, onClearNearMe }) {
  return (
    <div style={{ background: darkMode ? G.black : G.cream, padding: "12px 20px", borderBottom: `1px solid ${darkMode ? G.borderDark : G.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: darkMode ? "rgba(255,255,255,0.4)" : G.ink3, fontFamily: "DM Sans,sans-serif" }}>{count} listing{count !== 1 ? "s" : ""}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {["All", "Brand new", "Like new", "Used"].map((c) => (
            <button key={c} onClick={() => setCondition(c)}
              style={{ background: condition === c ? (darkMode ? G.goldBgDark : G.goldBg) : "transparent", color: condition === c ? G.gold : (darkMode ? "rgba(255,255,255,0.4)" : G.ink3), border: `1px solid ${condition === c ? "rgba(201,168,76,0.3)" : (darkMode ? "rgba(255,255,255,0.08)" : G.border)}`, borderRadius: 20, padding: "5px 13px", fontSize: 12, fontWeight: condition === c ? 600 : 400, cursor: "pointer", fontFamily: "DM Sans,sans-serif", transition: "all 0.15s" }}>{c}</button>
          ))}
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ background: darkMode ? G.surface : "#fff", color: darkMode ? "rgba(255,255,255,0.7)" : G.ink, border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : G.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans,sans-serif", outline: "none" }}>
            <option value="newest">Newest first</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          {navigator.geolocation && (
            <button onClick={() => nearMe ? onClearNearMe?.() : navigator.geolocation.getCurrentPosition((pos) => onNearMe?.(pos.coords.latitude, pos.coords.longitude))}
              style={{ background: nearMe ? (darkMode ? G.goldBgDark : G.goldBg) : "transparent", color: nearMe ? G.gold : (darkMode ? "rgba(255,255,255,0.4)" : G.ink3), border: `1px solid ${nearMe ? "rgba(201,168,76,0.3)" : (darkMode ? "rgba(255,255,255,0.08)" : G.border)}`, borderRadius: 20, padding: "5px 13px", fontSize: 12, fontWeight: nearMe ? 600 : 400, cursor: "pointer", fontFamily: "DM Sans,sans-serif", display: "flex", alignItems: "center", gap: 4 }}>📍 Near me</button>
          )}
        </div>
      </div>
    </div>
  );
}
