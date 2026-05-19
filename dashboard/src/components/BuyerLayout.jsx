import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, TrendingUp, ShoppingCart, Gavel, Heart, CreditCard, MessageSquare, LayoutDashboard, ExternalLink, LogOut } from 'lucide-react';
import useAuthStore, { ADMIN_ROLES } from '../store/auth';
import toast from 'react-hot-toast';
import NavItem from './NavItem';

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || 'https://alsell.vercel.app';

export default function BuyerLayout() {
  const { user, logout, canAccessSeller } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ position: 'fixed', top: 12, left: 12, zIndex: 60, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontSize: 18 }}>
        {sidebarOpen ? '×' : '☰'}
      </button>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)', letterSpacing: -0.5 }}>
            al<span style={{ color: 'var(--text-primary)' }}>sel</span>
          </div>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.06em' }}>
            BUYER DASHBOARD
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 6px 4px' }}>Buying</div>
          <NavItem to="/buyer/overview" icon={ShoppingBag} label="Overview" />
          <NavItem to="/buyer/offers" icon={ShoppingCart} label="My Offers" />
          <NavItem to="/buyer/bids" icon={Gavel} label="Auction Bids" />
          <NavItem to="/buyer/favourites" icon={Heart} label="Saved Listings" />
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '16px 6px 4px' }}>History</div>
          <NavItem to="/buyer/purchases" icon={CreditCard} label="Purchase History" />
          <NavItem to="/buyer/reviews" icon={MessageSquare} label="Reviews Given" />

          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '16px 6px 4px' }}>Switch portal</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 9, fontSize: 13, fontWeight: 500, color: 'var(--gold)', background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', marginBottom: 2 }}>
            <ShoppingBag size={15} />
            <span style={{ flex: 1 }}>Buyer view</span>
          </div>
          {(canAccessSeller || ADMIN_ROLES.includes(user?.role)) && (
            <NavItem to="/seller" icon={TrendingUp} label="Seller dashboard" />
          )}
          {ADMIN_ROLES.includes(user?.role) && (
            <NavItem to="/admin/overview" icon={LayoutDashboard} label="Admin console" />
          )}
          <a href={CLIENT_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 9, fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none', marginTop: 4 }}>
            <ExternalLink size={15} />
            <span style={{ flex: 1 }}>Back to Marketplace</span>
          </a>
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, background: 'var(--surface2)', marginBottom: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>
              {user?.username?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username}</div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content" style={{ flex: 1, marginLeft: 220, minHeight: '100vh', background: 'var(--black)' }}>
        <Outlet />
      </main>
    </div>
  );
}
