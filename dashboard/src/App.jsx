import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuthStore from './store/auth';
import Login from './pages/Login';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Listings from './pages/Listings';
import Reports from './pages/Reports';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminLog from './pages/AdminLog';

const ADMIN_ROLES = ['superadmin', 'moderator', 'staff'];

function RequireAuth() {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RequireAdmin() {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!ADMIN_ROLES.includes(user.role)) return <Navigate to="/seller" replace />;
  return <Outlet />;
}

function HomeRedirect() {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (ADMIN_ROLES.includes(user.role)) return <Navigate to="/overview" replace />;
  return <Navigate to="/seller" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomeRedirect />} />
            {/* Admin only routes */}
            <Route element={<RequireAdmin />}>
              <Route path="/overview" element={<Overview />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/log" element={<AdminLog />} />
            </Route>
            {/* All authenticated users */}
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/buyer" element={<BuyerDashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
