import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Eye, MousePointerClick, DollarSign } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '../../lib/api';
import StatCard from '../../components/StatCard';
import toast from 'react-hot-toast';

export default function SellerAnalytics() {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/seller/activity');
        setActivity({
          listings: (res.listings || []).map(d => ({ ...d, date: format(parseISO(d.date), 'MMM d') })),
          offers: (res.offers || []).map(d => ({ ...d, date: format(parseISO(d.date), 'MMM d') })),
        });
      } catch { toast.error('Failed to load analytics'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading analytics...</div>;

  const totalListings = activity?.listings?.reduce((s, d) => s + Number(d.count), 0) || 0;
  const totalOffers = activity?.offers?.reduce((s, d) => s + Number(d.count), 0) || 0;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Sales Analytics</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Last 30 days activity</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Listings created" value={totalListings} icon={TrendingUp} color="var(--gold)" />
        <StatCard label="Offers received" value={totalOffers} icon={Eye} color="var(--blue)" />
        <StatCard label="Conversion rate" value={totalListings > 0 ? `${Math.round((totalOffers / totalListings) * 100)}%` : '—'} icon={MousePointerClick} color="var(--green)" />
        <StatCard label="Avg offers/listing" value={totalListings > 0 ? (totalOffers / totalListings).toFixed(1) : '—'} icon={DollarSign} color="var(--gold)" />
      </div>

      {activity && (
        <>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Listings created by day</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={activity.listings}>
                <defs>
                  <linearGradient id="laGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12, fontFamily: 'DM Mono' }} />
                <Area type="monotone" dataKey="count" stroke="#C9A84C" fill="url(#laGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Offers received by day</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={activity.offers}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12, fontFamily: 'DM Mono' }} />
                <Bar dataKey="count" fill="#C9A84C" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
