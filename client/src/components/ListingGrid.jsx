import { G } from '../constants';
import ListingCard from './ListingCard';

export default function ListingGrid({ listings, darkMode, onOpen, favs, onFave }) {
  if (listings.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "DM Sans,sans-serif" }}>
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>◈</div>
        <div style={{ fontSize: 16, fontWeight: 500, color: darkMode ? "rgba(255,255,255,0.4)" : G.ink2 }}>No listings found</div>
        <div style={{ fontSize: 13, marginTop: 4, color: G.ink3 }}>Try a different search or category</div>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} darkMode={darkMode} onOpen={onOpen} isFaved={favs.includes(l.id)} onFave={onFave} />
      ))}
    </div>
  );
}
