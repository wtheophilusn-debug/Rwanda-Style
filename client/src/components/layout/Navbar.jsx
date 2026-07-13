import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Moon, Sun, Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';
import api from '../../utils/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlistIds } = useWishlist();
  const { dark, toggle: toggleDark } = useTheme();
  const { lang, toggle: toggleLang, t } = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?search=${search}`); setSearch(''); }
  };

  const handleLogout = () => { logout(); navigate('/'); setUserOpen(false); };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
      {/* Top Bar */}
      <div className="bg-green-700 text-white text-xs py-1.5 px-4 flex justify-between items-center">
        <span>{t.welcome}</span>
        <span>{t.freeDelivery}</span>
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
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 gap-2 border border-gray-200 dark:border-gray-700 focus-within:border-green-700 transition">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t.search}
            className="bg-transparent text-sm outline-none w-full text-gray-700 dark:text-gray-200" />
          <button type="submit" className="bg-green-700 text-white text-xs px-3 py-1 rounded-full hover:bg-green-600 flex-shrink-0">
            {t.searchBtn}
          </button>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-1 ml-auto">

          {/* Language Toggle */}
          <button onClick={toggleLang}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium transition">
            <Globe size={15} />
            {lang}
          </button>

          {/* Dark Mode */}
          <button onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hidden sm:block transition">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Wishlist */}
          <Link to="/dashboard/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition">
            <Heart size={20} />
            {wishlistIds.size > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {wishlistIds.size}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition">
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
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                  {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user.name?.split(' ')[0]}</span>
                <ChevronDown size={13} className="text-gray-400" />
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b dark:border-gray-700 mb-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    👤 {t.dashboard}
                  </Link>
                  <Link to="/dashboard/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    📦 {t.orders}
                  </Link>
                  <Link to="/dashboard/wishlist" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    ❤️ {t.wishlist}
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <hr className="my-1 dark:border-gray-700" />
                      <Link to="/admin" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50 dark:hover:bg-gray-700 font-medium">
                        🛠️ {t.adminPanel}
                      </Link>
                    </>
                  )}
                  <hr className="my-1 dark:border-gray-700" />
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 w-full">
                    🚪 {t.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">{t.login}</Link>
              <Link to="/register" className="text-sm bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-600">{t.register}</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 ml-1">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="border-t dark:border-gray-700 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
          <Link to="/" className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 hover:bg-green-50 dark:hover:bg-gray-800 transition">
            {t.home}
          </Link>
          <Link to="/products" className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 hover:bg-green-50 dark:hover:bg-gray-800 transition">
            {t.shop}
          </Link>

          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 hover:bg-green-50 dark:hover:bg-gray-800 transition">
              {t.categories} <ChevronDown size={14} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 py-2 z-50">
                {categories.map(cat => (
                  <Link key={cat._id} to={`/products?category=${cat._id}`}
                    onClick={() => setCatOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-700">
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/products?sort=createdAt" className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 hover:bg-green-50 dark:hover:bg-gray-800 transition">
            {t.newArrivals}
          </Link>
          <Link to="/products?sort=price_asc" className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 hover:bg-green-50 dark:hover:bg-gray-800 transition">
            {t.deals}
          </Link>
          <Link to="/contact" className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 hover:bg-green-50 dark:hover:bg-gray-800 transition">
            {t.contact}
          </Link>

          <div className="ml-auto flex items-center">
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
              🔥 Sale Up to 30% Off
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-4 space-y-2">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 gap-2 mb-3">
            <Search size={15} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search}
              className="bg-transparent text-sm outline-none w-full dark:text-gray-200" />
          </form>
          <div className="flex gap-2 mb-2">
            <button onClick={toggleLang} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium">
              <Globe size={14} /> {lang}
            </button>
            <button onClick={toggleDark} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs">
              {dark ? <Sun size={14} /> : <Moon size={14} />} {dark ? 'Light' : 'Dark'}
            </button>
          </div>
          {[{ label: t.home, to: '/' }, { label: t.shop, to: '/products' }, { label: t.newArrivals, to: '/products?sort=createdAt' }, { label: t.deals, to: '/products?sort=price_asc' }, { label: t.contact, to: '/contact' }].map(item => (
            <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg">
              {item.label}
            </Link>
          ))}
          {categories.map(cat => (
            <Link key={cat._id} to={`/products?category=${cat._id}`} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-700 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg pl-6">
              — {cat.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
