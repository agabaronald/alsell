import { G, CATEGORIES } from '../constants';

export default function CategoryStrip({ active, setActive, darkMode }) {
  return (
    <div style={{ background: darkMode ? G.surface : "#fff", borderBottom: `1px solid ${darkMode ? G.borderDark : G.border}`, overflowX: "auto", scrollbarWidth: "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", gap: 4, height: 54, alignItems: "center" }}>
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button key={cat.id} onClick={() => setActive(cat.id)}
              style={{ background: isActive ? G.gold : "transparent", color: isActive ? G.black : darkMode ? "rgba(255,255,255,0.5)" : G.ink2, border: isActive ? "none" : `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : G.border}`, borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: isActive ? 700 : 400, cursor: "pointer", fontFamily: "DM Sans,sans-serif", whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 11 }}>{cat.icon}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
