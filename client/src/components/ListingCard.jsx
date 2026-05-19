import { useState } from 'react';
import { G } from '../constants';
import { fmt, conditionColor, timeAgo } from '../utils';
import ListingPlaceholder from './ListingPlaceholder';
import AuctionBadge from './AuctionBadge';

export default function ListingCard({ listing, darkMode, onOpen, isFaved, onFave }) {
  const [hovered, setHovered] = useState(false);
  const cond = conditionColor(listing.condition);
  return (
    <div onClick={() => onOpen(listing)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: darkMode ? G.surface : "#fff", border: `1px solid ${darkMode ? (hovered ? "rgba(201,168,76,0.3)" : G.borderDark) : hovered ? "rgba(201,168,76,0.4)" : G.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s", transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? `0 8px 24px rgba(0,0,0,${darkMode ? "0.4" : "0.08"})` : "none" }}>
      <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
        {listing.photos && listing.photos.length > 0 ? (
          <img src={listing.photos[0]} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <ListingPlaceholder id={listing.id} category={listing.category} />
        )}
        <button onClick={(e) => { e.stopPropagation(); onFave(listing.id); }}
          style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: "50%", background: isFaved ? G.gold : "rgba(0,0,0,0.5)", border: isFaved ? "none" : "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
          <svg width="13" height="12" viewBox="0 0 12 11" fill="none">
            <path d="M6 10S1 6.5 1 3.5A2.5 2.5 0 0 1 6 2.27 2.5 2.5 0 0 1 11 3.5C11 6.5 6 10 6 10Z" fill={isFaved ? G.black : "none"} stroke={isFaved ? G.black : "#fff"} strokeWidth="1.3" />
          </svg>
        </button>
        <div style={{ position: "absolute", bottom: 8, left: 10, fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: "DM Sans,sans-serif" }}>{timeAgo(listing.created_at)}</div>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: darkMode ? G.gold : G.ink, fontFamily: "DM Sans,sans-serif", marginBottom: 3 }}>{fmt(listing.price)}</div>
        <div style={{ fontSize: 13, color: darkMode ? "rgba(255,255,255,0.7)" : G.ink2, fontFamily: "DM Sans,sans-serif", marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{listing.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {listing.condition && listing.condition !== "N/A" && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: darkMode ? "rgba(201,168,76,0.1)" : cond.bg, color: darkMode ? G.goldLight : cond.color, fontFamily: "DM Sans,sans-serif" }}>{listing.condition}</span>
          )}
          {listing.is_boosted && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(201,168,76,0.15)", color: G.gold, fontFamily: "DM Sans,sans-serif" }}>⚡ Boosted</span>
          )}
          {listing.is_auction && listing.auction_ends_at && (
            <AuctionBadge endsAt={listing.auction_ends_at} darkMode={darkMode} />
          )}
          <span style={{ fontSize: 11, color: G.ink3, fontFamily: "DM Sans,sans-serif" }}>📍 {listing.location}</span>
        </div>
      </div>
    </div>
  );
}
