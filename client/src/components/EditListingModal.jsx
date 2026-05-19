import { useState } from 'react';
import { G, CATEGORIES } from '../constants';
import { fmt, authHeaders } from '../utils';
import { API } from '../constants';

export default function EditListingModal({ listing, darkMode, onClose, onSaved, showToast }) {
  const [form, setForm] = useState({
    title: listing.title || '',
    description: listing.description || '',
    price: listing.price || '',
    category: listing.category || 'electronics',
    condition: listing.condition || 'Used',
    location: listing.location || '',
    photos: listing.photos || [],
  });
  const [saving, setSaving] = useState(false);
  const bg = darkMode ? G.surface : '#fff';
  const textPrimary = darkMode ? '#fff' : G.ink;
  const textSecondary = darkMode ? 'rgba(255,255,255,0.5)' : G.ink2;
  const borderColor = darkMode ? 'rgba(255,255,255,0.08)' : G.border;
  const inputStyle = { width: '100%', background: darkMode ? G.surface2 : G.cream, border: `1px solid ${borderColor}`, borderRadius: 9, padding: '11px 14px', fontSize: 14, color: textPrimary, fontFamily: 'DM Sans,sans-serif', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: 12, color: textSecondary, fontFamily: 'DM Sans,sans-serif', display: 'block', marginBottom: 5, fontWeight: 500 };

  const handleSave = async () => {
    if (!form.title || !form.price) { showToast('Title and price are required'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/listings/${listing.id}`, {
        method: 'PATCH', headers: authHeaders(),
        body: JSON.stringify({ title: form.title, description: form.description, price: Number(form.price), category: form.category, condition: form.condition, location: form.location, photos: form.photos }),
      });
      const data = await res.json();
      if (res.ok) { onSaved(data); showToast('Listing updated!'); onClose(); }
      else showToast(data.error || 'Failed to update listing');
    } catch { showToast('Network error — please try again'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: bg, borderRadius: 18, width: '100%', maxWidth: 520, overflow: 'hidden' }}>
        <div style={{ background: G.black, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'DM Sans,sans-serif' }}>Edit listing</div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 30, height: 30, color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '70vh', overflowY: 'auto' }}>
          <div>
            <label style={labelStyle}>Photos</label>
            {form.photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8, marginBottom: 8 }}>
                {form.photos.map((url, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => setForm(f => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }))}
                      style={{ position: 'absolute', top: 3, right: 3, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div onClick={() => document.getElementById('edit-photo-input').click()}
              style={{ border: `2px dashed ${darkMode ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.4)'}`, borderRadius: 10, padding: '12px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: 12, color: textSecondary, fontFamily: 'DM Sans,sans-serif' }}>+ Add more photos</div>
            </div>
            <input id="edit-photo-input" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple style={{ display: 'none' }}
              onChange={async (e) => {
                const files = Array.from(e.target.files);
                if (!files.length) return;
                const remaining = 10 - form.photos.length;
                if (remaining <= 0) { showToast('Maximum 10 photos'); return; }
                const toUpload = files.slice(0, remaining);
                const uploaded = [];
                for (const file of toUpload) {
                  const fd = new FormData();
                  fd.append('images', file);
                  try {
                    const res = await fetch(`${API}/images`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('alsel_token')}` }, body: fd });
                    const data = await res.json();
                    if (data.urls) uploaded.push(...data.urls);
                  } catch (err) { console.error(err); }
                }
                if (uploaded.length) setForm(f => ({ ...f, photos: [...f.photos, ...uploaded].slice(0, 10) }));
                e.target.value = '';
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>Title</label>
            <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Listing title" />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, height: 100, resize: 'none' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your item..." />
          </div>
          <div>
            <label style={labelStyle}>Price (UGX)</label>
            <input style={inputStyle} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            {form.price && <div style={{ fontSize: 11, color: G.gold, marginTop: 4, fontFamily: 'DM Sans,sans-serif' }}>{fmt(Number(form.price))}</div>}
          </div>
          <div>
            <label style={labelStyle}>Condition</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Brand new', 'Like new', 'Used', 'For parts'].map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, condition: c }))}
                  style={{ padding: '8px 16px', borderRadius: 20, border: `1px solid ${form.condition === c ? G.gold : borderColor}`, background: form.condition === c ? (darkMode ? G.goldBgDark : G.goldBg) : 'transparent', color: form.condition === c ? G.gold : textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: form.condition === c ? 600 : 400 }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Kampala, Entebbe..." />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['active', 'paused', 'sold'].map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                  style={{ flex: 1, padding: '8px', borderRadius: 9, border: `1px solid ${(form.status || 'active') === s ? G.gold : borderColor}`, background: (form.status || 'active') === s ? (darkMode ? G.goldBgDark : G.goldBg) : 'transparent', color: (form.status || 'active') === s ? G.gold : textSecondary, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: (form.status || 'active') === s ? 600 : 400, textTransform: 'capitalize' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
            <button onClick={onClose} style={{ flex: 1, background: 'transparent', border: `1.5px solid ${borderColor}`, borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, color: textSecondary, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving}
              style={{ flex: 2, background: G.gold, border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, color: G.black, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans,sans-serif', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
