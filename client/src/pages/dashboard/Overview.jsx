import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, XCircle, Heart, ShoppingCart, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';

const spendingData = [
  { month: 'Jan', amount: 0 }, { month: 'Feb', amount: 0 }, { month: 'Mar', amount: 0 },
  { month: 'Apr', amount: 0 }, { month: 'May', amount: 0 }, { month: 'Jun', amount: 0 },
];

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

export default function DashboardOverview() {
  const { user } = useAuth();
  const { cart, total } = useCart();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders/my'),
      api.get('/wishlist'),
      api.get('/products?limit=4'),
    ]).then(([o, w, p]) => {
      setOrders(o.data);
      setWishlist(w.data.products || []);
      setProducts(p.data.products);
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const pieData = [
    { name: 'Pending', value: stats.pending || 1 },
    { name: 'Processing', value: orders.filter(o => o.status === 'processing').length || 0 },
    { name: 'Delivered', value: stats.delivered || 0 },
    { name: 'Cancelled', value: stats.cancelled || 0 },
  ].filter(d => d.value > 0);

  // Build spending chart from real orders
  const chartData = [...spendingData];
  orders.forEach(o => {
    const month = new Date(o.createdAt).toLocaleString('default', { month: 'short' });
    const idx = chartData.findIndex(d => d.month === month);
    if (idx > -1) chartData[idx].amount += o.total;
  });

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <span>Home</span> <span className="mx-2">/</span> <span className="text-green-700 font-medium">Dashboard</span>
      </nav>

      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-green-100 mt-1">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', link: '/dashboard/orders' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600', link: '/dashboard/orders' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'bg-green-50 text-green-600', link: '/dashboard/orders' },
          { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'bg-red-50 text-red-600', link: '/dashboard/orders' },
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Spending Overview</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15803d" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#15803d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`RWF ${v.toLocaleString()}`, 'Spent']} />
              <Area type="monotone" dataKey="amount" stroke="#15803d" strokeWidth={2} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Order Status</h3>
          {stats.total === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No orders yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Orders</h3>
            <Link to="/dashboard/orders" className="text-sm text-green-700 hover:underline">View all</Link>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingBag size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No orders yet</p>
              <Link to="/products" className="text-green-700 text-sm hover:underline mt-1 block">Start shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map(order => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[order.status]}`}>{order.status}</span>
                  <p className="text-sm font-semibold text-green-700">RWF {order.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Wishlist</p>
                <p className="text-2xl font-bold text-gray-800">{wishlist.length}</p>
                <p className="text-xs text-gray-400">saved items</p>
              </div>
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
                <Heart size={22} className="text-pink-500" />
              </div>
            </div>
            <Link to="/dashboard/wishlist" className="text-xs text-green-700 hover:underline mt-2 block">View wishlist →</Link>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cart</p>
                <p className="text-2xl font-bold text-gray-800">{cart.length}</p>
                <p className="text-xs text-gray-400">RWF {total.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <ShoppingCart size={22} className="text-green-700" />
              </div>
            </div>
            <Link to="/dashboard/cart" className="text-xs text-green-700 hover:underline mt-2 block">View cart →</Link>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-green-700" />
            <h3 className="font-semibold text-gray-800">Recommended For You</h3>
          </div>
          <Link to="/products" className="text-sm text-green-700 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => (
            <Link key={p._id} to={`/products/${p._id}`} className="group">
              <img src={p.image || 'https://placehold.co/200x150'} alt={p.name}
                className="w-full h-28 object-cover rounded-xl group-hover:opacity-90 transition" />
              <p className="text-xs font-medium text-gray-700 mt-2 line-clamp-1">{p.name}</p>
              <p className="text-xs text-green-700 font-semibold">RWF {p.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
