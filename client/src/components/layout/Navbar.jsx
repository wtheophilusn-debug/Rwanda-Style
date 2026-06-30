import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Moon, Sun, Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const categories = ['Fashion & Clothing', 'Accessories', 'Home & Living', 'Food & Beverages', 'Arts & Crafts'];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState('EN');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?search=${search}`); setSearch(''); }
  };

  const handleLogout = () => { logout(); navigate('/'); setUserOpen(false); };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-green-700 text-white text-xs py-1.5 px-4 flex justify-between items-center">
        <span>🇷🇼 Welcome to Rwanda Style — Quality Products from Rwanda</span>
        <span>Free delivery on orders over RWF 50,000</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🇷🇼</span>
          <div>
            <span className="text-xl font-bold text-green-700 leading-none">Rwanda Style</span>
            <span className="block text-xs text-gray-400 leading-none">Online Marketplace</span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 border border-gray-200 focus-within:border-green-700 transition">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent text-sm outline-none w-full text-gray-700" />
          <button type="submit" className="bg-green-700 text-white text-xs px-3 py-1 rounded-full hover:bg-green-600 flex-shrink-0">
            Search
          </button>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-1 ml-auto">

          {/* Language Toggle */}
          <button onClick={() => setLang(l => l === 'EN' ? 'RW' : 'EN')}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 text-xs font-medium">
            <Globe size={15} />
            {lang}
          </button>

          {/* Dark Mode */}
          <button onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hidden sm:block">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Wishlist */}
          <Link to="/dashboard/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Heart size={20} />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">2</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-green-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative">
              <button onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition">
                <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name?.split(' ')[0]}</span>
                <ChevronDown size={13} className="text-gray-400" />
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border py-2 z-50">
                  <div className="px-4 py-2 border-b mb-1">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    👤 My Dashboard
                  </Link>
                  <Link to="/dashboard/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    📦 My Orders
                  </Link>
                  <Link to="/dashboard/wishlist" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    ❤️ Wishlist
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <hr className="my-1" />
                      <Link to="/admin" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50 font-medium">
                        🛠️ Admin Panel
                      </Link>
                    </>
                  )}
                  <hr className="my-1" />
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-600 hover:text-green-700 px-3 py-1.5 rounded-lg hover:bg-gray-100">Login</Link>
              <Link to="/register" className="text-sm bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-600">Register</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 ml-1">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="border-t hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
          <Link to="/" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition">
            Home
          </Link>
          <Link to="/products" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition">
            Shop
          </Link>

          {/* Categories Dropdown */}
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition">
              Categories <ChevronDown size={14} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-lg border py-2 z-50">
                {categories.map(cat => (
                  <Link key={cat} to={`/products?search=${encodeURIComponent(cat)}`}
                    onClick={() => setCatOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700">
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/products?sort=createdAt" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition">
            New Arrivals
          </Link>
          <Link to="/products?sort=price_asc" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition">
            Deals
          </Link>
          <Link to="/products" className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition">
            Contact
          </Link>

          {/* Promo Badge */}
          <div className="ml-auto flex items-center">
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
              🔥 Sale Up to 30% Off
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-2">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 mb-3">
            <Search size={15} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="bg-transparent text-sm outline-none w-full" />
          </form>
          {['Home', 'Shop', 'New Arrivals', 'Deals'].map(item => (
            <Link key={item} to={item === 'Home' ? '/' : '/products'} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg">
              {item}
            </Link>
          ))}
          {categories.map(cat => (
            <Link key={cat} to={`/products?search=${encodeURIComponent(cat)}`} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg pl-6">
              — {cat}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
