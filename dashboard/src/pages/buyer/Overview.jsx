import { useEffect, useState } from 'react';
import { ShoppingBag, Heart, Gavel, Star } from 'lucide-react';
import api from '../../lib/api';
import StatCard from '../../components/StatCard';
import toast from 'react-hot-toast';

export default function BuyerOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/buyer/overview');
        setOverview(res);
      } catch { toast.error('Failed to load overview'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading overview...</div>;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Buyer Dashboard</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Your buying activity and saved items</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
        <StatCard label="Offers made" value={overview?.offers?.total} sub={`${overview?.offers?.pending} pending`} icon={ShoppingBag} color="var(--blue)" />
        <StatCard label="Saved listings" value={overview?.favourites?.total} icon={Heart} color="var(--red)" />
        <StatCard label="Auction bids" value={overview?.bids?.total} sub={`${overview?.bids?.active_auctions} active`} icon={Gavel} color="var(--gold)" />
        <StatCard label="Reviews given" value={overview?.reviews?.total} icon={Star} color="var(--green)" />
      </div>
    </div>
  );
}
