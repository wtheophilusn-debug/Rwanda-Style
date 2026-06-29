import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';

const titles = {
  '/dashboard': 'Overview',
  '/dashboard/orders': 'My Orders',
  '/dashboard/tracking': 'Order Tracking',
  '/dashboard/wishlist': 'Wishlist',
  '/dashboard/cart': 'Shopping Cart',
  '/dashboard/reviews': 'My Reviews',
  '/dashboard/addresses': 'Saved Addresses',
  '/dashboard/payments': 'Payment Methods',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/settings': 'Account Settings',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} title={titles[pathname] || 'Dashboard'} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
