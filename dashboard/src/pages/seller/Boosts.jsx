import { useEffect, useState } from 'react';
import { Zap, Clock, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '../../lib/api';
import StatCard from '../../components/StatCard';
import toast from 'react-hot-toast';

export default function SellerBoosts() {
  const [boosts, setBoosts] = useState([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [h, c] = await Promise.allSettled([
          api.get('/boosts/history'),
          api.get('/boosts/credits'),
        ]);
        if (h.status === 'fulfilled') setBoosts(h.value);
        if (c.status === 'fulfilled') setCredits(c.value.credits ?? c.value.boost_credits ?? 0);
      } catch { toast.error('Failed to load boost history'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading boost history...</div>;

  const activeBoosts = boosts.filter(b => b.active);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Boost History</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Your boosted listings and credits</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Active boosts" value={activeBoosts.length} icon={Zap} color="var(--gold)" />
        <StatCard label="Total boosts" value={boosts.length} icon={Clock} color="var(--blue)" />
        <StatCard label="Credits remaining" value={credits} icon={CheckCircle} color="var(--green)" />
      </div>

      {boosts.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          No boosts yet. Boost your listings from the marketplace to get more visibility.
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Listing', 'Created', 'Expires', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '10px 14px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {boosts.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)' }}>{b.listing_title || `Listing #${b.listing_id}`}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{format(parseISO(b.created_at), 'MMM d, yyyy')}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{b.expires_at ? format(parseISO(b.expires_at), 'MMM d, yyyy HH:mm') : '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: b.active ? 'var(--green-dim)' : 'var(--surface3)', color: b.active ? 'var(--green)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {b.active ? 'Active' : 'Expired'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
