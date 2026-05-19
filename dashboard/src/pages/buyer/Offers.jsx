import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';
import toast from 'react-hot-toast';

export default function BuyerOffers() {
  const [offers, setOffers] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/buyer/offers?page=${page}`);
        setOffers(res.offers || []);
        setPages(res.pages || 1);
      } catch { toast.error('Failed to load offers'); }
      finally { setLoading(false); }
    };
    load();
  }, [page]);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading...</div>;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>My Offers</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Offers you've made to sellers</div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {offers.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>No offers made yet</div>
        ) : offers.map(o => (
          <div key={o.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            {o.listing_photos?.[0] && <img src={o.listing_photos[0]} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.listing_title}</div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>UGX {Number(o.amount).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>from {o.seller_name} {o.seller_verified ? '✓' : ''} · {format(new Date(o.created_at), 'MMM d')}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: o.status === 'accepted' ? 'var(--green-dim)' : o.status === 'declined' ? 'var(--red-dim)' : 'var(--gold-dim)', color: o.status === 'accepted' ? 'var(--green)' : o.status === 'declined' ? 'var(--red)' : 'var(--gold)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{o.status}</span>
          </div>
        ))}
        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </div>
  );
}
