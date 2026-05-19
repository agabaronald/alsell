import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';
import toast from 'react-hot-toast';

export default function BuyerFavourites() {
  const [favourites, setFavourites] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/buyer/favourites?page=${page}`);
        setFavourites(res.favourites || []);
        setPages(res.pages || 1);
      } catch { toast.error('Failed to load favourites'); }
      finally { setLoading(false); }
    };
    load();
  }, [page]);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading...</div>;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Saved Listings</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Listings you've saved for later</div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {favourites.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>No saved listings</div>
        ) : favourites.map(f => (
          <div key={f.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, border: f.price_dropped ? '1px solid rgba(61,214,140,0.15)' : 'none', background: f.price_dropped ? 'rgba(61,214,140,0.03)' : 'transparent' }}>
            {f.photos?.[0] && <img src={f.photos[0]} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>UGX {Number(f.price).toLocaleString()}</div>
                {f.price_dropped && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20, background: 'var(--green-dim)', color: 'var(--green)' }}>↓ {f.drop_percentage}% drop</span>
                )}
              </div>
              {f.price_dropped && <div style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through' }}>was UGX {Number(f.price_at_save).toLocaleString()}</div>}
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>by {f.seller} · {f.location}</div>
            </div>
            <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: f.status === 'active' ? 'var(--green-dim)' : 'var(--surface3)', color: f.status === 'active' ? 'var(--green)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{f.status}</span>
          </div>
        ))}
        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </div>
  );
}
