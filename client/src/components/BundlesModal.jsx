import { useState, useEffect } from 'react';
import { G } from '../constants';
import { fmt, authHeaders } from '../utils';
import { API } from '../constants';
import ListingPlaceholder from './ListingPlaceholder';
import BundleDetail from './BundleDetail';

export default function BundlesModal({ darkMode, onClose, user, onAuthRequired, showToast }) {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", bundle_price: "", listing_ids: [] });
  const [creating, setCreating] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const bg = darkMode ? G.surface : "#fff";
  const textPrimary = darkMode ? "#fff" : G.ink;
  const textSecondary = darkMode ? "rgba(255,255,255,0.5)" : G.ink2;
  const borderColor = darkMode ? G.borderDark : G.border;
  const inputStyle = { width: "100%", background: darkMode?G.surface2:G.cream, border:`1px solid ${borderColor}`, borderRadius: 9, padding: "10px 14px", fontSize: 14, color: textPrimary, fontFamily: "DM Sans,sans-serif", outline: "none", boxSizing: "border-box" };

  useEffect(() => {
    fetch(`${API}/bundles`)
      .then(r => r.json()).then(data => { setBundles(Array.isArray(data)?data:[]); setLoading(false); });
  }, []);

  const loadMyListings = async () => {
    const res = await fetch(`${API}/bundles/seller/listings`, { headers: authHeaders() });
    const data = await res.json();
    setMyListings(Array.isArray(data) ? data : []);
  };

  const handleCreate = async () => {
    if (form.listing_ids.length < 2) { alert("Select at least 2 listings"); return; }
    setCreating(true);
    try {
      const res = await fetch(`${API}/bundles`, {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ title: form.title, description: form.description, bundle_price: Number(form.bundle_price), listing_ids: form.listing_ids }),
      });
      const data = await res.json();
      if (res.ok) {
        setBundles(prev => [data, ...prev]);
        setShowCreate(false);
        setForm({ title: "", description: "", bundle_price: "", listing_ids: [] });
        showToast("Bundle created!");
      } else alert(data.error || "Failed to create bundle");
    } catch { alert("Network error"); }
    finally { setCreating(false); }
  };

  const toggleListing = (id) => {
    setForm(f => ({ ...f, listing_ids: f.listing_ids.includes(id) ? f.listing_ids.filter(i => i !== id) : [...f.listing_ids, id] }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ background: bg, borderRadius: 18, width: "100%", maxWidth: 580, overflow: "hidden" }}>
        <div style={{ background: G.black, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "DM Sans,sans-serif" }}>◈ Bundles</div>
          <div style={{ display: "flex", gap: 8 }}>
            {user && (
              <button onClick={() => { setShowCreate(!showCreate); loadMyListings(); }}
                style={{ background: G.gold, color: G.black, border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>
                + Create
              </button>
            )}
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        </div>
        <div style={{ maxHeight: 580, overflowY: "auto" }}>
          {showCreate && (
            <div style={{ padding: "16px", borderBottom: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, fontFamily: "DM Sans,sans-serif", marginBottom: 12 }}>Create a bundle</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input style={inputStyle} placeholder="Bundle title e.g. Full Home Studio Setup" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
                <textarea style={{...inputStyle, height: 60, resize: "none"}} placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
                <input style={inputStyle} type="number" placeholder="Bundle price (UGX)" value={form.bundle_price} onChange={e => setForm(f => ({...f, bundle_price: e.target.value}))} />
                <div style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif", fontWeight: 500 }}>Select listings to bundle (min 2):</div>
                {myListings.length === 0 ? (
                  <div style={{ fontSize: 13, color: G.ink3, fontFamily: "DM Sans,sans-serif", padding: "8px 0" }}>No active listings found. Post some listings first.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {myListings.map(l => (
                      <div key={l.id} onClick={() => toggleListing(l.id)}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, border: `1px solid ${form.listing_ids.includes(l.id)?G.gold:borderColor}`, background: form.listing_ids.includes(l.id)?(darkMode?G.goldBgDark:G.goldBg):"transparent", cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${form.listing_ids.includes(l.id)?G.gold:borderColor}`, background: form.listing_ids.includes(l.id)?G.gold:"transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {form.listing_ids.includes(l.id) && <span style={{ fontSize: 10, color: G.black, fontWeight: 700 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: textPrimary, fontFamily: "DM Sans,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                          <div style={{ fontSize: 11, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>{fmt(l.price)} · {l.condition}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {form.listing_ids.length >= 2 && form.bundle_price && (
                  <div style={{ background: darkMode?G.surface2:G.cream, borderRadius: 9, padding: "10px 14px", fontSize: 13, color: G.gold, fontFamily: "DM Sans,sans-serif", fontWeight: 500 }}>
                    Bundle saves buyers UGX {(myListings.filter(l => form.listing_ids.includes(l.id)).reduce((s,l)=>s+Number(l.price),0) - Number(form.bundle_price)).toLocaleString()}
                  </div>
                )}
                <button onClick={handleCreate} disabled={creating || form.listing_ids.length < 2 || !form.title || !form.bundle_price}
                  style={{ background: G.gold, border: "none", borderRadius: 9, padding: "11px", fontSize: 14, fontWeight: 700, color: G.black, cursor: "pointer", fontFamily: "DM Sans,sans-serif", opacity: creating?0.7:1 }}>
                  {creating ? "Creating..." : "Create bundle"}
                </button>
              </div>
            </div>
          )}
          <div style={{ padding: "16px" }}>
            {loading && <div style={{ textAlign: "center", padding: "40px", color: textSecondary, fontFamily: "DM Sans,sans-serif", fontSize: 13 }}>Loading...</div>}
            {!loading && bundles.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 12 }}>◈</div>
                <div style={{ fontSize: 15, color: textSecondary, fontFamily: "DM Sans,sans-serif" }}>No bundles yet</div>
                <div style={{ fontSize: 13, color: G.ink3, marginTop: 4 }}>Create one to sell multiple items together</div>
              </div>
            )}
            {bundles.map(b => (
              <div key={b.id} style={{ background: darkMode?G.surface2:G.cream, borderRadius: 12, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}
                onClick={() => setSelectedBundle(selectedBundle?.id===b.id ? null : b)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ flex: 1, paddingRight: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, fontFamily: "DM Sans,sans-serif" }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: textSecondary, fontFamily: "DM Sans,sans-serif", marginTop: 2 }}>by {b.seller} · {b.item_count} items</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: G.gold, fontFamily: "DM Sans,sans-serif" }}>{fmt(b.bundle_price)}</div>
                    {b.original_price && Number(b.original_price) > Number(b.bundle_price) && (
                      <div style={{ fontSize: 11, color: G.green, fontFamily: "DM Sans,sans-serif" }}>Save {fmt(Number(b.original_price) - Number(b.bundle_price))}</div>
                    )}
                  </div>
                </div>
                {b.description && <div style={{ fontSize: 13, color: textSecondary, fontFamily: "DM Sans,sans-serif", marginBottom: 8 }}>{b.description}</div>}
                {selectedBundle?.id === b.id && (
                  <BundleDetail bundleId={b.id} darkMode={darkMode} textSecondary={textSecondary} textPrimary={textPrimary} borderColor={borderColor} user={user} onAuthRequired={onAuthRequired} showToast={showToast} onClose={onClose} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
