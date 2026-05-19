import { useState, useEffect, useRef } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

import { G, API, DASHBOARD_URL } from "./constants";
import { authHeaders } from "./utils";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryStrip from "./components/CategoryStrip";
import FilterBar from "./components/FilterBar";
import ListingGrid from "./components/ListingGrid";
import ListingDetail from "./components/ListingDetail";
import SellModal from "./components/SellModal";
import SecurityCentre from "./components/SecurityCentre";
import AuthModal from "./components/AuthModal";
import NotificationsModal from "./components/NotificationsModal";
import OffersModal from "./components/OffersModal";
import FavouritesModal from "./components/FavouritesModal";
import BidModal from "./components/BidModal";
import BundlesModal from "./components/BundlesModal";
import ReportModal from "./components/ReportModal";
import ChatModal from "./components/ChatModal";

export default function Alsel() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('alsel_darkmode');
    return saved !== null ? saved === 'true' : true;
  });
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [condition, setCondition] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [nearMe, setNearMe] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showSell, setShowSell] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);
  const [showBundles, setShowBundles] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [reportListing, setReportListing] = useState(null);
  const [bidListing, setBidListing] = useState(null);
  const [bidAuction, setBidAuction] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [favs, setFavs] = useState([]);
  const [listings, setListings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("alsel_user")); }
    catch { return null; }
  });

  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");
    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("alsel_token", token);
        localStorage.setItem("alsel_user", JSON.stringify(userData));
        setUser(userData);
        showToast(`Welcome, ${userData.username}!`);
        window.history.replaceState({}, "", "/");
      } catch (err) {
        console.error("OAuth redirect error:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== "all") params.append("category", category);
        if (condition !== "All") params.append("condition", condition);
        if (activeSearch) params.append("q", activeSearch);
        if (sort) params.append("sort", sort);
        if (nearMe && userCoords) {
          params.append("lat", userCoords.lat);
          params.append("lng", userCoords.lng);
          params.append("radius", "20");
        }
        params.append("page", page);
        const res = await fetch(`${API}/listings?${params}`);
        const data = await res.json();
        if (data.listings) {
          setListings(prev => page === 1 ? data.listings : [...prev, ...data.listings]);
          setTotalCount(data.total || 0);
          setTotalPages(data.pages || 1);
        } else {
          setListings(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [category, condition, activeSearch, sort, nearMe, userCoords, page]);

  useEffect(() => {
    setPage(1);
  }, [category, condition, activeSearch, sort, nearMe, userCoords]);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await fetch(`${API}/notifications`, { headers: authHeaders() });
        const data = await res.json();
        if (Array.isArray(data)) setUnreadCount(data.filter((n) => !n.read).length);
      } catch (err) { console.error(err); }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetch(`${API}/favourites`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setFavs(data.map((f) => f.id)); });
  }, [user]);

  useEffect(() => {
    localStorage.setItem('alsel_darkmode', darkMode);
  }, [darkMode]);

  const toggleFav = async (id) => {
    if (!user) { setShowAuth(true); return; }
    const isFaved = favs.includes(id);
    const prevFavs = favs;
    setFavs((prev) => (isFaved ? prev.filter((f) => f !== id) : [...prev, id]));
    try {
      if (isFaved)
        await fetch(`${API}/favourites/${id}`, { method: "DELETE", headers: authHeaders() });
      else
        await fetch(`${API}/favourites`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ listing_id: id }) });
    } catch (err) { setFavs(prevFavs); console.error(err); }
  };

  const handleSearch = (override) => setActiveSearch(typeof override === "string" ? override : searchQuery);
  const handleAuth = (userData) => {
    setUser(userData);
    showToast(`Welcome, ${userData.username}!`);
    setUnreadCount(0);
  };
  const handleLogout = () => {
    localStorage.removeItem("alsel_token");
    localStorage.removeItem("alsel_user");
    setUser(null);
    setFavs([]);
    setUnreadCount(0);
    showToast("Signed out");
  };

  const handleDashboard = () => {
    const token = localStorage.getItem('alsel_token');
    const userData = localStorage.getItem('alsel_user');
    if (!token || !userData) { showToast('Please sign in'); return; }
    window.location.href = `${DASHBOARD_URL}/auth?token=${token}&user=${encodeURIComponent(userData)}`;
  };

  const handlePost = async (form, sellMode, auctionForm) => {
    const token = localStorage.getItem("alsel_token");
    if (!token) { showToast("Please sign in"); setShowAuth(true); return; }
    try {
      const endpoint = sellMode === "auction" ? `${API}/auctions` : `${API}/listings`;
      const body = sellMode === "auction"
        ? { title: form.title, description: form.description, category: form.category, condition: form.condition, location: form.location, photos: form.photos||[], starting_price: Number(form.price), reserve_price: auctionForm.reserve_price ? Number(auctionForm.reserve_price) : null, duration_hours: auctionForm.duration_hours }
        : { title: form.title, description: form.description, price: Number(form.price), category: form.category, condition: form.condition, location: form.location, latitude: form.latitude, longitude: form.longitude, photos: form.photos||[] };
      const res = await fetch(endpoint, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        const newListing = sellMode === "auction" ? data.listing : data;
        setListings(prev => [newListing, ...prev]);
        showToast(sellMode === "auction" ? "Auction started!" : "Listing posted!");
      } else showToast(data.error || "Failed to post");
    } catch { showToast("Network error"); }
  };

  const handleOpenListing = (listing) => {
    if (listing.is_auction) {
      setBidListing(listing);
      fetch(`${API}/auctions/listing/${listing.id}`, { headers: authHeaders() })
        .then(r => r.json())
        .then(data => setBidAuction(data))
        .catch(() => setSelectedListing(listing));
    } else {
      setSelectedListing(listing);
    }
  };

  return (
    <>
    <style>{`@media (max-width: 767px) { .modal-overlay { padding: 20px 12px !important; } }`}</style>
    <div style={{ minHeight: "100vh", background: darkMode ? G.black : G.cream, fontFamily: "DM Sans,sans-serif", transition: "background 0.3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {selectedListing && !showSell && !showAuth && !activeChat && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto" }}>
          <ListingDetail
            listing={selectedListing}
            darkMode={darkMode}
            onClose={() => setSelectedListing(null)}
            isFaved={favs.includes(selectedListing.id)}
            onFave={toggleFav}
            user={user}
            onMakeOffer={() => showToast("Offer sent!")}
            onAuthRequired={() => setShowAuth(true)}
            onReport={(l) => { setSelectedListing(null); setReportListing(l); }}
            showToast={showToast}
          />
        </div>
      )}

      {showSell && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto" }}>
          <SellModal darkMode={darkMode} onClose={() => setShowSell(false)} onPost={handlePost} showToast={showToast} />
        </div>
      )}

      {showSecurity && (
        <div style={{ position:"fixed", inset:0, zIndex:200, overflowY:"auto" }}>
          <SecurityCentre darkMode={darkMode} onClose={() => setShowSecurity(false)} user={user} showToast={showToast} />
        </div>
      )}

      {showAuth && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto" }}>
          <AuthModal darkMode={darkMode} onClose={() => setShowAuth(false)} onAuth={handleAuth} />
        </div>
      )}

      {showNotifications && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto" }}>
          <NotificationsModal darkMode={darkMode} onClose={() => { setShowNotifications(false); setUnreadCount(0); }} />
        </div>
      )}

      {showOffers && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto" }}>
          <OffersModal darkMode={darkMode} onClose={() => setShowOffers(false)} user={user}
            onOpenChat={(offer) => { setShowOffers(false); setActiveChat(offer); }} showToast={showToast} />
        </div>
      )}

      {showFavourites && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto" }}>
          <FavouritesModal darkMode={darkMode} onClose={() => setShowFavourites(false)} onOpen={handleOpenListing} />
        </div>
      )}

      {bidListing && bidAuction && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto" }}>
          <BidModal listing={bidListing} auction={bidAuction} darkMode={darkMode}
            onClose={() => { setBidListing(null); setBidAuction(null); }}
            user={user}
            onBidPlaced={() => {
              fetch(`${API}/auctions/${bidAuction.id}`, { headers: authHeaders() })
                .then(r => r.json()).then(data => setBidAuction(data));
            }}
          />
        </div>
      )}

      {showBundles && (
        <div style={{ position:"fixed", inset:0, zIndex:200, overflowY:"auto" }}>
          <BundlesModal darkMode={darkMode} onClose={() => setShowBundles(false)} user={user} onAuthRequired={() => setShowAuth(true)} showToast={showToast} />
        </div>
      )}

      {reportListing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto" }}>
          <ReportModal listing={reportListing} darkMode={darkMode} onClose={() => setReportListing(null)} />
        </div>
      )}

      {activeChat && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, overflowY: "auto" }}>
          <ChatModal offer={activeChat} darkMode={darkMode} onClose={() => setActiveChat(null)} user={user} />
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: G.gold, color: G.black, padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 300, fontFamily: "DM Sans,sans-serif", maxWidth: "90vw", textAlign: "center", wordBreak: "break-word" }}>
          {toast}
        </div>
      )}

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSell={() => (user ? setShowSell(true) : setShowAuth(true))}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        user={user}
        onAuthOpen={() => (user ? handleLogout() : setShowAuth(true))}
        onNotifications={() => setShowNotifications(true)}
        onOffers={() => (user ? setShowOffers(true) : setShowAuth(true))}
        onFavourites={() => user ? setShowFavourites(true) : setShowAuth(true)}
        onBundles={() => setShowBundles(true)}
        onSecurity={() => setShowSecurity(true)}
        onDashboard={handleDashboard}
        unreadCount={unreadCount}
      />
      <Hero onSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryStrip active={category} setActive={(c) => { setCategory(c); setActiveSearch(""); setSearchQuery(""); }} darkMode={darkMode} />
      <FilterBar
        sort={sort} setSort={setSort} condition={condition} setCondition={setCondition}
        darkMode={darkMode} count={totalCount}
        nearMe={nearMe}
        onNearMe={(lat, lng) => { setUserCoords({ lat, lng }); setNearMe(true); setActiveSearch(""); setSearchQuery(""); }}
        onClearNearMe={() => { setNearMe(false); setUserCoords(null); }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 60px" }}>
        {activeSearch && (
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: darkMode ? "#fff" : G.ink, fontFamily: "DM Sans,sans-serif" }}>
              Results for "{activeSearch}"
            </span>
            <button onClick={() => { setActiveSearch(""); setSearchQuery(""); }}
              style={{ background: "none", border: "none", color: G.gold, cursor: "pointer", fontSize: 13, fontFamily: "DM Sans,sans-serif" }}>
              Clear ×
            </button>
          </div>
        )}
        {loading && listings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 13, color: darkMode ? "rgba(255,255,255,0.3)" : G.ink3, fontFamily: "DM Sans,sans-serif" }}>
              Loading listings...
            </div>
          </div>
        ) : (
          <>
            <ListingGrid listings={listings} darkMode={darkMode} onOpen={handleOpenListing} favs={favs} onFave={toggleFav} />
            {page < totalPages && listings.length > 0 && (
              <div style={{ textAlign: "center", marginTop: 24, marginBottom: 8 }}>
                <button onClick={() => setPage(p => p + 1)} disabled={loading}
                  style={{ background: darkMode ? G.surface2 : G.cream, border: `1px solid ${darkMode ? G.borderDark : G.border}`, borderRadius: 10, padding: "11px 28px", fontSize: 13, fontWeight: 600, color: darkMode ? "#fff" : G.ink, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, fontFamily: "DM Sans,sans-serif", transition: "all 0.15s" }}>
                  {loading ? "Loading..." : "Load more listings"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ background: G.black, borderTop: "1px solid rgba(201,168,76,0.1)", padding: "32px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 22, fontFamily: "DM Sans,sans-serif", fontWeight: 700, color: G.gold, marginBottom: 6, letterSpacing: -0.5 }}>
          al<span style={{ color: "#fff" }}>sel</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "DM Sans,sans-serif" }}>
          © 2026 Alsel · Uganda's marketplace ·
        </div>
      </div>
    </div>
    </>
  );
}
