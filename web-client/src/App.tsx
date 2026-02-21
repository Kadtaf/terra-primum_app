import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuthStore } from "./stores/authStore";

// Layouts
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";

// Public pages
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import LoyaltyPage from "./pages/LoyaltyPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import RegisterPage from "./pages/RegisterPage";

// Admin pages
import DashboardHome from "./admin/admin-dashboard/DashboardHome";
import MenuManagement from "./admin/admin-dashboard/MenuManagement";
import OrdersManagement from "./admin/admin-dashboard/OrdersManagement";
import UsersManagement from "./admin/admin-dashboard/UsersManagement";
import RestaurantSettingsManagement from "./admin/admin-dashboard/RestaurantSettingsManagement";
import CategoriesManagement from "./admin/admin-dashboard/CategoriesManagement";
import StatsDashboard from "./admin/admin-dashboard/StatsDashboard";

// Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";

// Loader
import GlobalLoader from "./components/GlobalLoader";

import Notification from "@/components/Notification";
import { useNotificationStore } from "@/stores/notificationStore";

function App() {
  const { isAuthenticated, loadUser, isLoading } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const notif = useNotificationStore((s) => s.notif);
  const clearNotif = useNotificationStore((s) => s.clearNotif);


  return (
    <>
      {isLoading && <GlobalLoader />}

      <Router>
        {notif && (
          <Notification
            type={notif.type}
            title={notif.title}
            message={notif.message}
            onClose={clearNotif}
          />
        )}

        <Routes>
          {/* PUBLIC LAYOUT */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/orders/:id"
              element={
                isAuthenticated ? <OrderDetailPage /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/loyalty"
              element={
                isAuthenticated ? <LoyaltyPage /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/profile"
              element={
                isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />
              }
            />
          </Route>

          {/* ADMIN LAYOUT (séparé du public) */}
          <Route
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin" element={<DashboardHome />} />
            <Route path="/admin/menu" element={<MenuManagement />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route
              path="/admin/categories"
              element={<CategoriesManagement />}
            />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route
              path="/admin/settings"
              element={<RestaurantSettingsManagement />}
            />
            <Route path="/admin/stats" element={<StatsDashboard />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
