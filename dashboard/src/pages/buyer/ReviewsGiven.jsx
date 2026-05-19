import { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '../../lib/api';
import StatCard from '../../components/StatCard';
import toast from 'react-hot-toast';

export default function BuyerReviewsGiven() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/buyer/reviews');
        setReviews(res);
      } catch { toast.error('Failed to load reviews'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading reviews...</div>;

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Reviews Given</h1>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Reviews you've left for sellers</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total reviews" value={reviews.length} icon={Star} color="var(--gold)" />
        <StatCard label="Avg rating given" value={reviews.length > 0 ? `★ ${avgRating.toFixed(1)}` : '—'} icon={MessageSquare} color="var(--green)" />
      </div>

      {reviews.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          No reviews yet. Leave a review after making a purchase.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.seller_name || 'Seller'}</span>
                  <span style={{ fontSize: 12, color: 'var(--gold)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{format(parseISO(r.created_at), 'MMM d, yyyy')}</span>
              </div>
              {r.listing_title && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{r.listing_title}</div>
              )}
              {r.comment && (
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.comment}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
