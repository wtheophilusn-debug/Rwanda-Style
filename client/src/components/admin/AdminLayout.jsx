import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const titles = {
  '/admin': 'Dashboard Overview',
  '/admin/products': 'Products Management',
  '/admin/orders': 'Orders Management',
  '/admin/categories': 'Categories Management',
  '/admin/customers': 'Customers',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title={titles[pathname] || 'Admin'} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
