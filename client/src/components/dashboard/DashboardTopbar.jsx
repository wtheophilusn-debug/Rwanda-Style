import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardTopbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-green-700">
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">{title}</h1>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
        <Search size={16} className="text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders, products..."
          className="bg-transparent text-sm outline-none w-full text-gray-700" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button onClick={() => navigate('/dashboard/notifications')}
          className="relative p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-full pl-1 pr-3 py-1 transition">
            <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold overflow-hidden">
              {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-1 z-50">
              <button onClick={() => { navigate('/dashboard/settings'); setDropdownOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                <User size={15} /> My Profile
              </button>
              <button onClick={() => { navigate('/dashboard/settings'); setDropdownOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                <Settings size={15} /> Settings
              </button>
              <hr className="my-1" />
              <button onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full">
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
