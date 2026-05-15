import { create } from 'zustand';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('alsel_dashboard_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    console.log('Auth store loaded user:', user);
    return user;
  } catch {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem('alsel_dashboard_token'),

  login: (user, token) => {
    console.log('Logging in user:', user);
    localStorage.setItem('alsel_dashboard_token', token);
    localStorage.setItem('alsel_dashboard_user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('alsel_dashboard_token');
    localStorage.removeItem('alsel_dashboard_user');
    set({ user: null, token: null });
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

const ADMIN_ROLES = ['superadmin', 'moderator', 'staff'];

export default useAuthStore;
