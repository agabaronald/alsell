import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, Package, MessageSquare, Flag, TrendingUp, Zap, Star, Gavel } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '../lib/api';
import StatCard from '../components/StatCard';
import toast from 'react-hot-toast';

const COLORS = ['#C9A84C', '#4B9FFF', '#3DD68C', '#E05050', '#A78BFA', '#F59E0B', '#06B6D4', '#EC4899'];

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [listingGrowth, setListingGrowth] = useState([]);
  const [categories, setCategories] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, ug, lg, cat, conv, ts] = await Promise.all([
          api.get('/admin/analytics/overview'),
          api.get('/admin/analytics/user-growth'),
          api.get('/admin/analytics/listing-growth'),
          api.get('/admin/analytics/categories'),
          api.get('/admin/analytics/conversions'),
          api.get('/admin/analytics/top-sellers'),
        ]);
        setStats(s);
        setUserGrowth(ug.map(d => ({ ...d, date: format(parseISO(d.date), 'MMM d') })));
        // Aggregate listing growth by date
        const lgMap = {};
        lg.forEach(d => {
          const date = format(parseISO(d.date), 'MMM d');
          lgMap[date] = (lgMap[date] || 0) + Number(d.count);
        });
        setListingGrowth(Object.entries(lgMap).map(([date, count]) => ({ date, count })));
        setCategories(cat);
        setConversions(conv.map(d => ({ ...d, date: format(parseISO(d.date), 'MMM d') })));
        setTopSellers(ts);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 1s infinite' }} />
      Loading platform data...
    </div>
  );

  return (
    <>
    <style>{`@media (max-width: 767px) { .ov-charts { grid-template-columns: 1fr !important; } .ov-page { padding: 16px !important; } }`}</style>
    <div className="ov-page" style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Platform Overview</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Live data · Updated {format(new Date(), 'MMM d, yyyy HH:mm')}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total users" value={stats?.total_users?.toLocaleString()} sub={`+${stats?.new_users_today} today`} icon={Users} color="var(--blue)" />
        <StatCard label="Active listings" value={stats?.total_listings?.toLocaleString()} sub={`+${stats?.new_listings_today} today`} icon={Package} color="var(--gold)" />
        <StatCard label="Total offers" value={stats?.total_offers?.toLocaleString()} sub={`${stats?.offers_today} today`} icon={TrendingUp} color="var(--green)" />
        <StatCard label="Messages" value={stats?.total_messages?.toLocaleString()} icon={MessageSquare} color="var(--blue)" />
        <StatCard label="Pending reports" value={stats?.pending_reports?.toLocaleString()} icon={Flag} color={stats?.pending_reports > 0 ? 'var(--red)' : 'var(--text-muted)'} />
        <StatCard label="Active boosts" value={stats?.active_boosts?.toLocaleString()} icon={Zap} color="var(--gold)" />
        <StatCard label="Total reviews" value={stats?.total_reviews?.toLocaleString()} icon={Star} color="var(--green)" />
        <StatCard label="Active auctions" value={stats?.active_auctions?.toLocaleString()} icon={Gavel} color="var(--blue)" />
      </div>

      {/* Charts row 1 */}
      <div className="ov-charts" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* User growth */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>User growth</div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 16 }}>Last 30 days</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4B9FFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4B9FFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12, fontFamily: 'DM Mono' }} />
              <Area type="monotone" dataKey="count" stroke="#4B9FFF" fill="url(#userGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Listing growth */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Listing growth</div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 16 }}>Last 30 days</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={listingGrowth}>
              <defs>
                <linearGradient id="listingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12, fontFamily: 'DM Mono' }} />
              <Area type="monotone" dataKey="count" stroke="#C9A84C" fill="url(#listingGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="ov-charts" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Category breakdown */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Listings by category</div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 16 }}>All time</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categories} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={75} strokeWidth={0}>
                {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12, fontFamily: 'DM Mono' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'DM Mono', color: 'rgba(240,239,233,0.5)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Offer conversions */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Offer conversions</div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 16 }}>Last 30 days</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conversions}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(240,239,233,0.3)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12, fontFamily: 'DM Mono' }} />
              <Bar dataKey="accepted" fill="#3DD68C" radius={[3,3,0,0]} stackId="a" />
              <Bar dataKey="declined" fill="#E05050" radius={[3,3,0,0]} stackId="a" />
              <Bar dataKey="pending" fill="#C9A84C" radius={[3,3,0,0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top sellers */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Top sellers</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Username', 'Email', 'Role', 'Listings', 'Sold', 'Rating', 'Verified', 'Joined'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 12px 10px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topSellers.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginRight: 8, fontSize: 11 }}>#{i+1}</span>
                    {s.username}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{s.email}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: s.role === 'superadmin' ? 'var(--gold-dim)' : 'var(--surface3)', color: s.role === 'superadmin' ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.role}</span>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{s.listing_count}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{s.sold_count}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
                    {s.rating_avg ? `★ ${Number(s.rating_avg).toFixed(1)}` : '—'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 11, color: s.is_verified ? 'var(--green)' : 'var(--text-muted)' }}>{s.is_verified ? '✓ Yes' : '—'}</span>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {format(new Date(s.created_at), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}