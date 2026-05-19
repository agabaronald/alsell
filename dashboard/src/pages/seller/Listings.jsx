import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';
import DashboardEditForm from '../../components/DashboardEditForm';
import toast from 'react-hot-toast';

export default function SellerListings() {
  const [listings, setListings] = useState([]);
  const [listingPages, setListingPages] = useState(1);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingListing, setEditingListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/seller/listings?page=${page}`);
        setListings(res.listings || []);
        setListingPages(res.pages || 1);
      } catch { toast.error('Failed to load listings'); }
      finally { setLoading(false); }
    };
    load();
  }, [page]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/listings/${id}`, { status });
      setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      toast.success('Listing updated');
    } catch { toast.error('Failed to update listing'); }
  };

  const filtered = filter ? listings.filter(l => l.status === filter) : listings;

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading listings...</div>;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>My Listings</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Manage your active and past listings</div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>All listings</div>
          <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: 11, color: 'var(--text-primary)', cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-mono)' }}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>No listings</div>
        ) : filtered.map(l => (
          <div key={l.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            {l.photos?.[0] && <img src={l.photos[0]} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>UGX {Number(l.price).toLocaleString()}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 3, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>{l.offer_count} offers</span>
                <span>{l.favourite_count} saves</span>
                <span>{l.view_count || 0} views</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: l.status === 'active' ? 'var(--green-dim)' : l.status === 'sold' ? 'var(--blue-dim)' : 'var(--surface3)', color: l.status === 'active' ? 'var(--green)' : l.status === 'sold' ? 'var(--blue)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{l.status}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {l.status === 'active' && <button onClick={() => handleStatusChange(l.id, 'paused')} style={{ fontSize: 10, background: 'var(--surface3)', border: 'none', borderRadius: 5, padding: '2px 7px', color: 'var(--text-muted)', cursor: 'pointer' }}>Pause</button>}
                {l.status === 'paused' && <button onClick={() => handleStatusChange(l.id, 'active')} style={{ fontSize: 10, background: 'var(--green-dim)', border: 'none', borderRadius: 5, padding: '2px 7px', color: 'var(--green)', cursor: 'pointer' }}>Activate</button>}
                <button onClick={() => setEditingListing(l)} style={{ fontSize: 10, background: 'var(--gold-dim)', border: 'none', borderRadius: 5, padding: '2px 7px', color: 'var(--gold)', cursor: 'pointer' }}>Edit</button>
              </div>
            </div>
          </div>
        ))}
        <Pagination page={page} pages={listingPages} onPageChange={setPage} />
      </div>

      {editingListing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px', overflowY: 'auto' }}>
          <div style={{ background: 'var(--surface)', borderRadius: 16, width: '100%', maxWidth: 500, overflow: 'hidden' }}>
            <div style={{ background: 'var(--black)', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Edit listing</div>
              <button onClick={() => setEditingListing(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 28, height: 28, color: '#fff', cursor: 'pointer', fontSize: 14 }}>×</button>
            </div>
            <DashboardEditForm
              listing={editingListing}
              onSave={async (form) => {
                try {
                  await api.patch(`/listings/${editingListing.id}`, form);
                  setListings(prev => prev.map(l => l.id === editingListing.id ? { ...l, ...form } : l));
                  setEditingListing(null);
                  toast.success('Listing updated!');
                } catch (err) { toast.error(err.error || 'Failed to update'); }
              }}
              onCancel={() => setEditingListing(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
