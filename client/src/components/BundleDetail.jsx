import { useState, useEffect } from 'react';
import { G } from '../constants';
import { fmt } from '../utils';
import { API } from '../constants';
import ListingPlaceholder from './ListingPlaceholder';

export default function BundleDetail({ bundleId, darkMode, textSecondary, textPrimary, borderColor, user, onAuthRequired, showToast, onClose }) {
  const [detail, setDetail] = useState(null);
  const [offerSent, setOfferSent] = useState(false);

  useEffect(() => {
    fetch(`${API}/bundles/${bundleId}`)
      .then(r => r.json()).then(data => !data.error && setDetail(data));
  }, [bundleId]);

  if (!detail) return <div style={{ fontSize: 13, color: textSecondary, fontFamily: "DM Sans,sans-serif", padding: "8px 0" }}>Loading items...</div>;

  return (
    <div style={{ marginTop: 10, borderTop: `1px solid ${borderColor}`, paddingTop: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: textSecondary, fontFamily: "DM Sans,sans-serif", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Items in this bundle</div>
      {detail.items.map(item => (
        <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${borderColor}` }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
            {item.photos?.[0] ? <img src={item.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ListingPlaceholder id={item.id} category={item.category} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: textPrimary, fontFamily: "DM Sans,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
            <div style={{ fontSize: 11, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>{fmt(item.price)} individually</div>
          </div>
        </div>
      ))}
      {!offerSent ? (
        <button onClick={() => { if (!user) { onAuthRequired(); return; } setOfferSent(true); showToast("Bundle offer sent!"); }}
          style={{ width: "100%", marginTop: 12, background: G.gold, color: G.black, border: "none", borderRadius: 9, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>
          ◈ Buy bundle — {fmt(detail.bundle_price)}
        </button>
      ) : (
        <div style={{ marginTop: 12, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 9, padding: "12px", textAlign: "center", fontSize: 13, color: G.gold, fontFamily: "DM Sans,sans-serif", fontWeight: 600 }}>
          Bundle offer sent! The seller will contact you.
        </div>
      )}
    </div>
  );
}
