import { useState } from 'react';

const inputStyle = { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' };
const labelStyle = { fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' };

export default function DashboardEditForm({ listing, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: listing.title || '',
    description: listing.description || '',
    price: listing.price || '',
    condition: listing.condition || 'Used',
    location: listing.location || '',
    status: listing.status || 'active',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...form, price: Number(form.price) });
    setSaving(false);
  };

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '65vh', overflowY: 'auto' }}>
      <div><label style={labelStyle}>Title</label><input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
      <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, height: 80, resize: 'none' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
      <div><label style={labelStyle}>Price (UGX)</label><input style={inputStyle} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
      <div>
        <label style={labelStyle}>Condition</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Brand new', 'Like new', 'Used', 'For parts'].map(c => (
            <button key={c} onClick={() => setForm(f => ({ ...f, condition: c }))}
              style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${form.condition === c ? 'var(--gold)' : 'var(--border)'}`, background: form.condition === c ? 'var(--gold-dim)' : 'transparent', color: form.condition === c ? 'var(--gold)' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div><label style={labelStyle}>Location</label><input style={inputStyle} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
      <div>
        <label style={labelStyle}>Status</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {['active', 'paused', 'sold'].map(s => (
            <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
              style={{ flex: 1, padding: '7px', borderRadius: 8, border: `1px solid ${form.status === s ? 'var(--gold)' : 'var(--border)'}`, background: form.status === s ? 'var(--gold-dim)' : 'transparent', color: form.status === s ? 'var(--gold)' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
        <button onClick={onCancel} style={{ flex: 1, background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '10px', fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
        <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: 'var(--gold)', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, color: 'var(--black)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
