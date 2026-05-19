import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, Star, Zap } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '../../lib/api';
import StatCard from '../../components/StatCard';
import toast from 'react-hot-toast';

export default function SellerOverview() {
  const [overview, setOverview] = useState(null);
  const [activity, setActivity] = useState({ listings: [], offers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const results = await Promise.allSettled([
          api.get('/seller/overview'),
          api.get('/seller/activity'),
        ]);
        const [ov, ac] = results;
        if (ov.status === 'fulfilled') setOverview(ov.value);
        else console.error('Overview failed:', ov.reason);
        if (ac.status === 'fulfilled') {
          setActivity({
            listings: (ac.value.listings || []).map(d => ({ ...d, date: format(parseISO(d.date), 'MMM d') })),
            offers: (ac.value.offers || []).map(d => ({ ...d, date: format(parseISO(d.date), 'MMM d') })),
          });
        } else console.error('Activity failed:', ac.reason);
      } catch {
        toast.error('Failed to load overview');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading overview...</div>;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Seller Dashboard</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Your selling performance and listings</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total listings" value={overview?.listings?.total} sub={`${overview?.listings?.active} active · ${overview?.listings?.sold} sold`} icon={Package} color="var(--gold)" />
        <StatCard label="Incoming offers" value={overview?.offers?.total} sub={`${overview?.offers?.pending} pending`} icon={TrendingUp} color="var(--green)" />
        <StatCard label="Avg rating" value={overview?.reviews?.avg_rating ? `★ ${Number(overview.reviews.avg_rating).toFixed(1)}` : '—'} sub={`${overview?.reviews?.total} reviews`} icon={Star} color="var(--gold)" />
        <StatCard label="Active boosts" value={overview?.boosts?.active_boosts} icon={Zap} color="var(--gold)" />
      </div>

      {(activity.listings.length > 0 || activity.offers.length > 0) && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Activity — last 30 days</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={activity.listings}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12, fontFamily: 'DM Mono' }} />
              <Area type="monotone" dataKey="count" stroke="#C9A84C" fill="url(#actGrad)" strokeWidth={2} dot={false} name="Listings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
