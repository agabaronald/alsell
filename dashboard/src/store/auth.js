import { create } from 'zustand';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('alsel_dashboard_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user;
  } catch {
    return null;
  }
};

const ADMIN_ROLES = ['superadmin', 'moderator', 'staff'];

const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem('alsel_dashboard_token'),
  canAccessSeller: localStorage.getItem('alsel_can_seller') === 'true',
  canAccessBuyer: localStorage.getItem('alsel_can_buyer') === 'true',

  login: (user, token) => {
    localStorage.setItem('alsel_dashboard_token', token);
    localStorage.setItem('alsel_dashboard_user', JSON.stringify(user));
    set({ user, token });
  },

  setStatus: ({ has_seller_activity, has_buyer_activity }) => {
    localStorage.setItem('alsel_can_seller', String(!!has_seller_activity));
    localStorage.setItem('alsel_can_buyer', String(!!has_buyer_activity));
    set({ canAccessSeller: !!has_seller_activity, canAccessBuyer: !!has_buyer_activity });
  },

  logout: () => {
    localStorage.removeItem('alsel_dashboard_token');
    localStorage.removeItem('alsel_dashboard_user');
    localStorage.removeItem('alsel_can_seller');
    localStorage.removeItem('alsel_can_buyer');
    set({ user: null, token: null, canAccessSeller: false, canAccessBuyer: false });
  },

  isSuperAdmin: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'superadmin';
  },

  isModerator: () => {
    const state = useAuthStore.getState();
    return ADMIN_ROLES.includes(state.user?.role);
  },
}));

export { ADMIN_ROLES };
export default useAuthStore;
