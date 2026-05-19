import { useState } from 'react';
import { G } from '../constants';

export default function Navbar({ darkMode, setDarkMode, onSell, searchQuery, setSearchQuery, onSearch, user, onAuthOpen, onNotifications, unreadCount, onOffers, onFavourites, onBundles, onSecurity, onDashboard }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const iconBtn = {
    background: "none",
    border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : G.border}`,
    borderRadius: 8, width: 36, height: 36, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: darkMode ? G.gold : G.ink2, fontSize: 14,
  };

  const mobileIconBtn = {
    ...iconBtn, width: '100%', height: 44, borderRadius: 10, justifyContent: 'flex-start', gap: 12, padding: '0 14px', fontSize: 14, fontWeight: 500,
  };

  return (
    <>
      <style>{`
        .nav-mobile-overlay {
          position: fixed; inset: 0; z-index: 199; background: rgba(0,0,0,0.4);
          opacity: 0; pointer-events: none; transition: opacity 0.25s;
        }
        .nav-mobile-overlay.open {
          opacity: 1; pointer-events: auto;
        }
        .nav-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 280px; max-width: 80vw;
          z-index: 200; overflow-y: auto;
          background: ${darkMode ? G.black : '#fff'};
          transform: translateX(-100%); transition: transform 0.25s;
          padding: 20px 16px; display: flex; flex-direction: column; gap: 6;
        }
        .nav-drawer.open { transform: translateX(0); }
        .nav-desktop-icons { display: flex; align-items: center; gap: 8; }
        .nav-hamburger { display: none; }
        @media (max-width: 767px) {
          .nav-desktop-icons { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-search { max-width: none !important; }
        }
      `}</style>
      <nav style={{ background: darkMode ? G.black : "#fff", borderBottom: `1px solid ${darkMode ? G.borderDark : G.border}`, position: "sticky", top: 0, zIndex: 100, transition: "background 0.3s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 24, fontFamily: "'Clash Display','DM Sans',sans-serif", fontWeight: 700, letterSpacing: -1, color: G.gold, flexShrink: 0 }}>
            al<span style={{ color: darkMode ? "#fff" : G.ink }}>sel</span>
          </div>
          <div className="nav-search" style={{ flex: 1, maxWidth: 480, display: "flex", alignItems: "center", background: darkMode ? G.surface : G.cream, border: `1.5px solid ${darkMode ? "rgba(201,168,76,0.2)" : G.border}`, borderRadius: 10, padding: "0 14px", height: 40, gap: 8 }}>
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
          <div className="nav-desktop-icons" style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setDarkMode(!darkMode)} style={iconBtn}>
              {darkMode ? "☀" : "☾"}
            </button>
            {user && (
              <>
                <button onClick={onFavourites} title="Favourites" style={iconBtn}>
                  <svg width="16" height="16" viewBox="0 0 12 11" fill="none">
                    <path d="M6 10S1 6.5 1 3.5A2.5 2.5 0 0 1 6 2.27 2.5 2.5 0 0 1 11 3.5C11 6.5 6 10 6 10Z" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </button>
                <button onClick={onOffers} title="Offers" style={iconBtn}>◎</button>
                <button onClick={onBundles} title="Bundles" style={iconBtn}>◈</button>
                <button onClick={onNotifications} style={{ ...iconBtn, position: "relative" }}>
                  🔔
                  {unreadCount > 0 && (
                    <span style={{ position: "absolute", top: -4, right: -4, background: G.gold, color: G.black, borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <button onClick={onDashboard} title="Dashboard" style={iconBtn}>⊞</button>
                <button onClick={onSecurity} title="Security Centre" style={iconBtn}>🔐</button>
              </>
            )}
            <button onClick={onSell} style={{ background: G.gold, color: G.black, border: "none", borderRadius: 9, padding: "0 18px", height: 36, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>+ Sell</button>
            <div onClick={onAuthOpen} style={{ width: 36, height: 36, borderRadius: "50%", background: darkMode ? "rgba(201,168,76,0.15)" : G.goldBg, border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: G.gold, cursor: "pointer" }}>
              {user ? user.username.slice(0, 2).toUpperCase() : "?"}
            </div>
          </div>
          <button className="nav-hamburger" onClick={() => setMenuOpen(true)} style={{ background: "none", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : G.border}`, borderRadius: 8, width: 36, height: 36, cursor: "pointer", alignItems: "center", justifyContent: "center", color: darkMode ? G.gold : G.ink2, fontSize: 18 }}>☰</button>
        </div>
      </nav>
      <div className={`nav-mobile-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`}>
        <div style={{ fontSize: 24, fontFamily: "'Clash Display','DM Sans',sans-serif", fontWeight: 700, letterSpacing: -1, color: G.gold, marginBottom: 16 }}>
          al<span style={{ color: darkMode ? "#fff" : G.ink }}>sel</span>
        </div>
        <button onClick={() => { setDarkMode(!darkMode); setMenuOpen(false); }} style={mobileIconBtn}>
          {darkMode ? "☀" : "☾"} {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        {user && (
          <>
            <button onClick={() => { onFavourites(); setMenuOpen(false); }} style={mobileIconBtn}>
              <svg width="16" height="16" viewBox="0 0 12 11" fill="none">
                <path d="M6 10S1 6.5 1 3.5A2.5 2.5 0 0 1 6 2.27 2.5 2.5 0 0 1 11 3.5C11 6.5 6 10 6 10Z" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              Favourites
            </button>
            <button onClick={() => { onOffers(); setMenuOpen(false); }} style={mobileIconBtn}>
              ◎ Offers
            </button>
            <button onClick={() => { onBundles(); setMenuOpen(false); }} style={mobileIconBtn}>
              ◈ Bundles
            </button>
            <button onClick={() => { onNotifications(); setMenuOpen(false); }} style={{ ...mobileIconBtn, position: "relative" }}>
              🔔 Notifications
              {unreadCount > 0 && (
                <span style={{ marginLeft: 'auto', background: G.gold, color: G.black, borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </button>
            <button onClick={() => { onDashboard(); setMenuOpen(false); }} style={mobileIconBtn}>
              ⊞ Dashboard
            </button>
            <button onClick={() => { onSecurity(); setMenuOpen(false); }} style={mobileIconBtn}>
              🔐 Security
            </button>
          </>
        )}
        <button onClick={() => { onSell(); setMenuOpen(false); }} style={{ ...mobileIconBtn, background: G.gold, color: G.black, border: 'none' }}>
          + Sell
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={() => { onAuthOpen(); setMenuOpen(false); }} style={{ ...mobileIconBtn, borderTop: `1px solid ${darkMode ? G.borderDark : G.border}`, marginTop: 8, paddingTop: 14, borderRadius: 0 }}>
          {user ? `Sign out (${user.username})` : 'Sign in'}
        </button>
      </div>
    </>
  );
}
