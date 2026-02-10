import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoyaltyPage from './pages/LoyaltyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersManagement from '@/admin/admin-dashboard/OrdersManagement';
import MenuManagement from '@/admin/admin-dashboard/MenuManagement';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/adminRoute';
import AdminLayout from './components/AdminLayout';
import DashboardHome from './admin/admin-dashboard/DashboardHome';
import RestaurantSettings from '@/admin/admin-dashboard/RestaurantSettings';




function App() {
  const { isAuthenticated, loadUser } = useAuthStore();


  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes protégées */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
          path="/checkout"element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
          />
          <Route path="/orders" element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />} />
          <Route path="/orders/:id" element={isAuthenticated ? <OrderDetailPage /> : <Navigate to="/login" />} />
          <Route path="/loyalty" element={isAuthenticated ? <LoyaltyPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        </Route>

          {/* Routes Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <DashboardHome />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminLayout>
                <OrdersManagement />
              </AdminLayout>
            </AdminRoute>
          }
        />
            

        <Route
          path="/admin/menu"
          element={
            <AdminRoute>
              <AdminLayout>
                <MenuManagement />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminLayout>
                <RestaurantSettings />
              </AdminLayout>
            </AdminRoute>
          }
        />



        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
