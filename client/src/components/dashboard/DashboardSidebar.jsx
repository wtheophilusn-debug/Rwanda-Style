import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, ShoppingBag, Heart, ShoppingCart,
  MapPin, CreditCard, Bell, Star, Settings, LogOut, X, Package
} from 'lucide-react';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/orders', icon: ShoppingBag, label: 'My Orders' },
  { to: '/dashboard/tracking', icon: Package, label: 'Order Tracking' },
  { to: '/dashboard/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/dashboard/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/dashboard/reviews', icon: Star, label: 'My Reviews' },
  { to: '/dashboard/addresses', icon: MapPin, label: 'Saved Addresses' },
  { to: '/dashboard/payments', icon: CreditCard, label: 'Payment Methods' },
  { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { to: '/dashboard/settings', icon: Settings, label: 'Account Settings' },
];

export default function DashboardSidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Overlay for mobile */}
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-30 flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shadow-none lg:z-auto`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <span className="text-xl font-bold text-green-700">Rwanda Style</span>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b bg-green-50">
          <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center text-lg font-bold mb-2">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p className="font-semibold text-gray-800 text-sm truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all
                ${isActive ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`
              }>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
