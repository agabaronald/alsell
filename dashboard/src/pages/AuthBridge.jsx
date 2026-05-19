import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import useAuthStore, { ADMIN_ROLES } from '../store/auth';

export default function AuthBridge() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, setStatus } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const userParam = params.get('user');

    if (!token || !userParam) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      login(user, token);
      window.history.replaceState({}, '', '/auth');
    } catch {
      navigate('/login', { replace: true });
      return;
    }

    (async () => {
      try {
        const status = await api.get('/user/status');
        setStatus(status);

        if (ADMIN_ROLES.includes(status.role)) {
          navigate('/admin/overview', { replace: true });
        } else if (status.has_seller_activity) {
          navigate('/seller', { replace: true });
        } else {
          navigate('/buyer', { replace: true });
        }
      } catch {
        if (ADMIN_ROLES.includes(useAuthStore.getState().user?.role)) {
          navigate('/admin/overview', { replace: true });
        } else {
          navigate('/seller', { replace: true });
        }
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Authenticating...</div>
    </div>
  );
}
