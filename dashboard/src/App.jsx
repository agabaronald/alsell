import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuthStore, { ADMIN_ROLES } from './store/auth';
import Login from './pages/Login';
import AuthBridge from './pages/AuthBridge';
import AdminLayout from './components/AdminLayout';
import SellerLayout from './components/SellerLayout';
import BuyerLayout from './components/BuyerLayout';
import Overview from './pages/Overview';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Listings from './pages/Listings';
import Reports from './pages/Reports';
import SellerOverview from './pages/seller/Overview';
import SellerListings from './pages/seller/Listings';
import SellerOffers from './pages/seller/Offers';
import SellerReviews from './pages/seller/Reviews';
import BuyerOverview from './pages/buyer/Overview';
import BuyerOffers from './pages/buyer/Offers';
import BuyerBids from './pages/buyer/Bids';
import BuyerFavourites from './pages/buyer/Favourites';
import AdminLog from './pages/AdminLog';

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
  if (ADMIN_ROLES.includes(user.role)) return <Navigate to="/admin/overview" replace />;
  const canSell = useAuthStore.getState().canAccessSeller;
  if (canSell) return <Navigate to="/seller" replace />;
  return <Navigate to="/buyer" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<AuthBridge />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomeRedirect />} />

          {/* Admin portal */}
          <Route element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/overview" element={<Overview />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/users/:id" element={<UserDetail />} />
              <Route path="/admin/listings" element={<Listings />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/log" element={<AdminLog />} />
            </Route>
          </Route>

          {/* Seller portal */}
          <Route element={<SellerLayout />}>
            <Route path="/seller" element={<Navigate to="/seller/overview" replace />} />
            <Route path="/seller/overview" element={<SellerOverview />} />
            <Route path="/seller/listings" element={<SellerListings />} />
            <Route path="/seller/offers" element={<SellerOffers />} />
            <Route path="/seller/reviews" element={<SellerReviews />} />
          </Route>

          {/* Buyer portal */}
          <Route element={<BuyerLayout />}>
            <Route path="/buyer" element={<Navigate to="/buyer/overview" replace />} />
            <Route path="/buyer/overview" element={<BuyerOverview />} />
            <Route path="/buyer/offers" element={<BuyerOffers />} />
            <Route path="/buyer/bids" element={<BuyerBids />} />
            <Route path="/buyer/favourites" element={<BuyerFavourites />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
