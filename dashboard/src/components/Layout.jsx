import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Flag, ScrollText, TrendingUp, ShoppingBag, LogOut, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/auth';
import toast from 'react-hot-toast';

const NavItem = ({ to, icon: Icon, label, badge }) => (
  <NavLink to={to} style={({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
    borderRadius: 9, fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
    color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
    background: isActive ? 'var(--gold-dim)' : 'transparent',
    border: isActive ? '1px solid var(--gold-border)' : '1px solid transparent',
    marginBottom: 2,
  })}>
    <Icon size={15} />
    <span style={{ flex: 1 }}>{label}</span>
    {badge > 0 && (
      <span style={{ background: 'var(--red)', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{badge}</span>
    )}
  </NavLink>
);

export default function Layout() {
  const { user, logout, isSuperAdmin, isModerator } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)', letterSpacing: -0.5 }}>
            al<span style={{ color: 'var(--text-primary)' }}>sel</span>
          </div>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.06em' }}>
            MANAGEMENT CONSOLE
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {isModerator() && (
            <>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 6px 4px' }}>Platform</div>
              <NavItem to="/overview" icon={LayoutDashboard} label="Overview" />
              <NavItem to="/users" icon={Users} label="Users" />
              <NavItem to="/listings" icon={Package} label="Listings" />
              <NavItem to="/reports" icon={Flag} label="Reports" />
              {isSuperAdmin() && <NavItem to="/log" icon={ScrollText} label="Audit log" />}
            </>
          )}
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 6px 4px' }}>My account</div>
          <NavItem to="/seller" icon={TrendingUp} label="Seller dashboard" />
          <NavItem to="/buyer" icon={ShoppingBag} label="Buyer dashboard" />
        </nav>

        {/* User */}
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
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 220, minHeight: '100vh', background: 'var(--black)' }}>
        <Outlet />
      </main>
    </div>
  );
}