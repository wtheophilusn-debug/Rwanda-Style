import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-wide">Rwanda Style</Link>

      <div className="flex items-center gap-4">
        <Link to="/products" className="hover:underline">Shop</Link>

        <Link to="/cart" className="relative">
          <ShoppingCart size={22} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cart.length}
            </span>
          )}
        </Link>

        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" title="Dashboard"><LayoutDashboard size={20} /></Link>
            )}
            <Link to="/profile" title="Profile"><User size={20} /></Link>
            <button onClick={handleLogout} title="Logout"><LogOut size={20} /></button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="bg-yellow-400 text-black px-3 py-1 rounded font-semibold hover:bg-yellow-300">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
