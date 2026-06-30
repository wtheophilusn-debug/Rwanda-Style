import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Tag, Users, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../utils/api';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminOverview() {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0, customers: 0, revenue: 0, pending: 0, delivered: 0 });
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState(months.map(m => ({ month: m, revenue: 0, orders: 0 })));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=1'),
      api.get('/orders'),
      api.get('/categories'),
    ]).then(([p, o, c]) => {
      const allOrders = o.data;
      setOrders(allOrders);
      const revenue = allOrders.reduce((s, o) => s + o.total, 0);
      const pending = allOrders.filter(o => o.status === 'pending').length;
      const delivered = allOrders.filter(o => o.status === 'delivered').length;
      setStats({ products: p.data.total, orders: allOrders.length, categories: c.data.length, revenue, pending, delivered });

      // Build revenue chart
      const chart = months.map(m => ({ month: m, revenue: 0, orders: 0 }));
      allOrders.forEach(o => {
        const m = new Date(o.createdAt).getMonth();
        chart[m].revenue += o.total;
        chart[m].orders += 1;
      });
      setRevenueData(chart);
    }).finally(() => setLoading(false));
  }, []);

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `RWF ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-600', link: '/admin/orders' },
          { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', link: '/admin/orders' },
          { label: 'Products', value: stats.products, icon: Package, color: 'bg-purple-50 text-purple-600', link: '/admin/products' },
          { label: 'Categories', value: stats.categories, icon: Tag, color: 'bg-yellow-50 text-yellow-600', link: '/admin/categories' },
        ].map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Second stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Pending Orders', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Delivered Orders', value: stats.delivered, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Avg Order Value', value: `RWF ${stats.orders ? Math.round(stats.revenue / stats.orders).toLocaleString() : 0}`, icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`RWF ${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Orders Per Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-green-700 hover:underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No orders yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>{['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 6).map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs font-semibold">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3">{order.user?.name || 'Customer'}</td>
                  <td className="px-5 py-3 font-semibold text-green-700">RWF {order.total.toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>{order.status}</span></td>
                  <td className="px-5 py-3 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
