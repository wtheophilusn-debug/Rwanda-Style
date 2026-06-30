import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import api from '../../utils/api';

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminAnalytics() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/orders'), api.get('/products?limit=100')])
      .then(([o, p]) => { setOrders(o.data); setProducts(p.data.products); })
      .finally(() => setLoading(false));
  }, []);

  // Revenue by month
  const revenueByMonth = months.map((m, i) => {
    const monthOrders = orders.filter(o => new Date(o.createdAt).getMonth() === i);
    return { month: m, revenue: monthOrders.reduce((s, o) => s + o.total, 0), orders: monthOrders.length };
  });

  // Orders by status
  const statusData = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => ({
    name: s, value: orders.filter(o => o.status === s).length
  })).filter(d => d.value > 0);

  // Top products by revenue
  const productRevenue = {};
  orders.forEach(o => o.products.forEach(item => {
    const name = item.product?.name || 'Unknown';
    if (!productRevenue[name]) productRevenue[name] = 0;
    productRevenue[name] += item.price * item.quantity;
  }));
  const topProducts = Object.entries(productRevenue).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, revenue]) => ({ name: name.length > 20 ? name.slice(0, 20) + '...' : name, revenue }));

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/admin" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Analytics</span>
      </nav>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `RWF ${orders.reduce((s, o) => s + o.total, 0).toLocaleString()}` },
          { label: 'Total Orders', value: orders.length },
          { label: 'Total Products', value: products.length },
          { label: 'Conversion Rate', value: `${orders.length > 0 ? ((orders.filter(o => o.status === 'delivered').length / orders.length) * 100).toFixed(1) : 0}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Revenue & Orders — 2026</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueByMonth}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={v => [`RWF ${v.toLocaleString()}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} fill="url(#rev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Orders by Status</h3>
          {statusData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No orders yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Top Products by Revenue</h3>
          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No sales data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                <Tooltip formatter={v => [`RWF ${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
