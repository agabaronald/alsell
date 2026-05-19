import { NavLink } from 'react-router-dom';

const NavItem = ({ to, icon: Icon, label, badge }) => (
  <NavLink to={to} style={({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
    borderRadius: 9, fontSize: 13, fontWeight: 500,
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

export default NavItem;
