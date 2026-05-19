import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';
import toast from 'react-hot-toast';

export default function SellerOffers() {
  const [offers, setOffers] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/seller/offers?page=${page}`);
        setOffers(res.offers || []);
        setPages(res.pages || 1);
      } catch { toast.error('Failed to load offers'); }
      finally { setLoading(false); }
    };
    load();
  }, [page]);

  const handleOfferAction = async (offerId, action) => {
    try {
      await api.patch(`/offers/${offerId}/${action}`);
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: action === 'accept' ? 'accepted' : 'declined' } : o));
      toast.success(`Offer ${action}ed`);
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading offers...</div>;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Incoming Offers</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Review and respond to buyer offers</div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {offers.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>No offers yet</div>
        ) : offers.map(o => (
          <div key={o.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', flex: 1, paddingRight: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.listing_title}</div>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: o.status === 'accepted' ? 'var(--green-dim)' : o.status === 'declined' ? 'var(--red-dim)' : 'var(--gold-dim)', color: o.status === 'accepted' ? 'var(--green)' : o.status === 'declined' ? 'var(--red)' : 'var(--gold)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{o.status}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold)', marginBottom: 4 }}>UGX {Number(o.amount).toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>from {o.buyer_name} · {o.buyer_rating ? `★ ${Number(o.buyer_rating).toFixed(1)}` : 'No rating'}</div>
            {o.status === 'pending' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => handleOfferAction(o.id, 'accept')} style={{ flex: 1, background: 'var(--green-dim)', border: 'none', borderRadius: 6, padding: '7px', fontSize: 12, color: 'var(--green)', cursor: 'pointer', fontWeight: 600 }}>Accept</button>
                <button onClick={() => handleOfferAction(o.id, 'decline')} style={{ flex: 1, background: 'var(--red-dim)', border: 'none', borderRadius: 6, padding: '7px', fontSize: 12, color: 'var(--red)', cursor: 'pointer', fontWeight: 600 }}>Decline</button>
              </div>
            )}
          </div>
        ))}
        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </div>
  );
}
