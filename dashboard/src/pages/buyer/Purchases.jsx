import { useEffect, useState } from 'react';
import { ShoppingBag, Package } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '../../lib/api';
import StatCard from '../../components/StatCard';
import toast from 'react-hot-toast';

export default function BuyerPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/buyer/purchases');
        setPurchases(res);
      } catch { toast.error('Failed to load purchase history'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading purchase history...</div>;

  const totalSpent = purchases.reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Purchase History</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Your completed purchases and accepted offers</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total purchases" value={purchases.length} icon={ShoppingBag} color="var(--gold)" />
        <StatCard label="Total spent" value={`UGX ${totalSpent.toLocaleString()}`} icon={Package} color="var(--green)" />
      </div>

      {purchases.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          No purchases yet. Make an offer on a listing to get started.
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Item', 'Seller', 'Amount', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '10px 14px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)' }}>{p.listing_title || `Listing #${p.listing_id}`}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.seller_name || '—'}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>UGX {Number(p.amount).toLocaleString()}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{format(parseISO(p.updated_at), 'MMM d, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
