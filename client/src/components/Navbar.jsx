import { G } from '../constants';

export default function Navbar({ darkMode, setDarkMode, onSell, searchQuery, setSearchQuery, onSearch, user, onAuthOpen, onNotifications, unreadCount, onOffers, onFavourites, onBundles, onSecurity, onDashboard }) {
  return (
    <nav style={{ background: darkMode ? G.black : "#fff", borderBottom: `1px solid ${darkMode ? G.borderDark : G.border}`, position: "sticky", top: 0, zIndex: 100, transition: "background 0.3s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 24, fontFamily: "'Clash Display','DM Sans',sans-serif", fontWeight: 700, letterSpacing: -1, color: G.gold, flexShrink: 0 }}>
          al<span style={{ color: darkMode ? "#fff" : G.ink }}>sel</span>
        </div>
        <div style={{ flex: 1, maxWidth: 480, display: "flex", alignItems: "center", background: darkMode ? G.surface : G.cream, border: `1.5px solid ${darkMode ? "rgba(201,168,76,0.2)" : G.border}`, borderRadius: 10, padding: "0 14px", height: 40, gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke={G.ink3} strokeWidth="1.5" />
            <path d="M9 9L13 13" stroke={G.ink3} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch()} placeholder="Search listings..."
            style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, color: darkMode ? "rgba(255,255,255,0.8)" : G.ink, outline: "none", fontFamily: "DM Sans,sans-serif" }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: G.ink3, fontSize: 16 }}>×</button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ background: "none", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : G.border}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? G.gold : G.ink2, fontSize: 14 }}>
            {darkMode ? "☀" : "☾"}
          </button>
          {user && (
            <>
              <button onClick={onFavourites} title="Favourites"
                style={{ background: "none", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : G.border}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? G.gold : G.ink2 }}>
                <svg width="16" height="16" viewBox="0 0 12 11" fill="none">
                  <path d="M6 10S1 6.5 1 3.5A2.5 2.5 0 0 1 6 2.27 2.5 2.5 0 0 1 11 3.5C11 6.5 6 10 6 10Z" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
              <button onClick={onOffers} title="Offers"
                style={{ background: "none", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : G.border}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? G.gold : G.ink2, fontSize: 13 }}>◎</button>
              <button onClick={onBundles} title="Bundles"
                style={{ background: "none", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : G.border}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? G.gold : G.ink2, fontSize: 13 }}>◈</button>
              <button onClick={onNotifications}
                style={{ position: "relative", background: "none", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : G.border}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? G.gold : G.ink2, fontSize: 14 }}>
                🔔
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, background: G.gold, color: G.black, borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <button onClick={onDashboard} title="Dashboard"
                style={{ background: "none", border: `1px solid ${darkMode?"rgba(255,255,255,0.1)":G.border}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode?G.gold:G.ink2, fontSize: 14 }}>☰</button>
              <button onClick={onSecurity} title="Security Centre"
                style={{ background: "none", border: `1px solid ${darkMode?"rgba(255,255,255,0.1)":G.border}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode?G.gold:G.ink2, fontSize: 14 }}>🔐</button>
            </>
          )}
          <button onClick={onSell}
            style={{ background: G.gold, color: G.black, border: "none", borderRadius: 9, padding: "0 18px", height: 36, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>+ Sell</button>
          <div onClick={onAuthOpen}
            style={{ width: 36, height: 36, borderRadius: "50%", background: darkMode ? "rgba(201,168,76,0.15)" : G.goldBg, border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: G.gold, cursor: "pointer" }}>
            {user ? user.username.slice(0, 2).toUpperCase() : "?"}
          </div>
        </div>
      </div>
    </nav>
  );
}
