import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, ThumbsUp, MessageSquare, Clock } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function SellerTrust() {
  const [trust, setTrust] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/trust/me');
        setTrust(res);
      } catch { toast.error('Failed to load trust score'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading trust score...</div>;

  const breakdown = trust?.breakdown || {};
  const factors = [
    { label: 'Account age', value: breakdown.account_age_score, max: 20, icon: Clock, color: 'var(--blue)' },
    { label: 'Verification', value: breakdown.verification_score, max: 15, icon: CheckCircle, color: 'var(--green)' },
    { label: 'Listing quality', value: breakdown.listing_quality_score, max: 20, icon: ThumbsUp, color: 'var(--gold)' },
    { label: 'Transaction history', value: breakdown.transaction_score, max: 25, icon: MessageSquare, color: 'var(--gold)' },
    { label: 'Reviews received', value: breakdown.review_score, max: 20, icon: Star, color: 'var(--green)' },
  ];

  const levelColors = { low: 'var(--red)', medium: 'var(--gold)', high: 'var(--green)' };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Trust Score</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Your seller reputation breakdown</div>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, textAlign: 'center', minWidth: 200, flex: 1 }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: levelColors[trust?.level] || 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
            {trust?.score ?? '—'}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: levelColors[trust?.level] || 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            {trust?.level || 'Unknown'}
          </div>
          <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(trust?.score ?? 0, 100)}%`, background: levelColors[trust?.level] || 'var(--text-muted)', borderRadius: 3, transition: 'width 0.5s' }} />
          </div>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 6 }}>out of 100</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {factors.map(f => {
          const pct = f.max > 0 ? ((f.value || 0) / f.max) * 100 : 0;
          return (
            <div key={f.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <f.icon size={18} color={f.color} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{f.label}</div>
                <div style={{ height: 4, background: 'var(--surface3)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: f.color, borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>{f.value ?? 0}/{f.max}</div>
            </div>
          );
        })}
      </div>

      {breakdown.negative_feedback_count > 0 && (
        <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--red-dim)', border: '1px solid rgba(224,80,80,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={16} color="var(--red)" />
          <div style={{ fontSize: 12, color: 'var(--red)', fontFamily: 'DM Sans,sans-serif' }}>
            {breakdown.negative_feedback_count} negative {breakdown.negative_feedback_count === 1 ? 'review' : 'reviews'} affecting your score
          </div>
        </div>
      )}
    </div>
  );
}

function Star() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--green)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
}
