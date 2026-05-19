import { useEffect, useState } from 'react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';
import toast from 'react-hot-toast';

export default function BuyerBids() {
  const [bids, setBids] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/buyer/bids?page=${page}`);
        setBids(res.bids || []);
        setPages(res.pages || 1);
      } catch { toast.error('Failed to load bids'); }
      finally { setLoading(false); }
    };
    load();
  }, [page]);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading...</div>;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Auction Bids</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Your bids on active auctions</div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {bids.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>No bids placed yet</div>
        ) : bids.map(b => (
          <div key={b.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            {b.listing_photos?.[0] && <img src={b.listing_photos[0]} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.listing_title}</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>My bid: UGX {Number(b.amount).toLocaleString()}</div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Current: UGX {Number(b.current_price).toLocaleString()}</div>
              </div>
              {b.is_winning && <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>Winning bid</div>}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: b.auction_status === 'active' ? 'var(--green-dim)' : 'var(--surface3)', color: b.auction_status === 'active' ? 'var(--green)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{b.auction_status}</span>
          </div>
        ))}
        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </div>
  );
}
