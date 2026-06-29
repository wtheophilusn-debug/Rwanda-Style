import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ui/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';

import Home            from './pages/Home';
import Products        from './pages/Products';
import ProductDetail   from './pages/ProductDetail';
import Cart            from './pages/Cart';
import Checkout        from './pages/Checkout';
import Login           from './pages/Login';
import Register        from './pages/Register';
import Orders          from './pages/Orders';
import Profile         from './pages/Profile';

import AdminDashboard    from './pages/admin/Dashboard';
import AdminProducts     from './pages/admin/AdminProducts';
import AdminOrders       from './pages/admin/AdminOrders';
import AdminCategories   from './pages/admin/AdminCategories';

import Overview          from './pages/dashboard/Overview';
import DashboardOrders   from './pages/dashboard/DashboardOrders';
import OrderTracking     from './pages/dashboard/OrderTracking';
import DashboardWishlist from './pages/dashboard/DashboardWishlist';
import DashboardCart     from './pages/dashboard/DashboardCart';
import DashboardReviews  from './pages/dashboard/DashboardReviews';
import SavedAddresses    from './pages/dashboard/SavedAddresses';
import PaymentMethods    from './pages/dashboard/PaymentMethods';
import Notifications     from './pages/dashboard/Notifications';
import AccountSettings   from './pages/dashboard/AccountSettings';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><ProtectedRoute><Checkout /></ProtectedRoute></PublicLayout>} />
            <Route path="/orders" element={<PublicLayout><ProtectedRoute><Orders /></ProtectedRoute></PublicLayout>} />
            <Route path="/profile" element={<PublicLayout><ProtectedRoute><Profile /></ProtectedRoute></PublicLayout>} />

            {/* Admin routes */}
            <Route path="/admin" element={<PublicLayout><ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute></PublicLayout>} />
            <Route path="/admin/products" element={<PublicLayout><ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute></PublicLayout>} />
            <Route path="/admin/orders" element={<PublicLayout><ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute></PublicLayout>} />
            <Route path="/admin/categories" element={<PublicLayout><ProtectedRoute adminOnly><AdminCategories /></ProtectedRoute></PublicLayout>} />

            {/* Customer Dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Overview />} />
              <Route path="orders" element={<DashboardOrders />} />
              <Route path="tracking" element={<OrderTracking />} />
              <Route path="wishlist" element={<DashboardWishlist />} />
              <Route path="cart" element={<DashboardCart />} />
              <Route path="reviews" element={<DashboardReviews />} />
              <Route path="addresses" element={<SavedAddresses />} />
              <Route path="payments" element={<PaymentMethods />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
