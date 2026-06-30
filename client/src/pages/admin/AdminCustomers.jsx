import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import api from '../../utils/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => {
      setOrders(data);
      // Extract unique customers from orders
      const map = {};
      data.forEach(o => {
        if (o.user) {
          if (!map[o.user._id]) map[o.user._id] = { ...o.user, orders: 0, spent: 0 };
          map[o.user._id].orders += 1;
          map[o.user._id].spent += o.total;
        }
      });
      setCustomers(Object.values(map));
    }).finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/admin" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Customers</span>
      </nav>

      <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2 max-w-sm">
        <Search size={16} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
          className="outline-none text-sm w-full" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-800">{filtered.length} Customers</h3>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No customers found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>{['Customer', 'Email', 'Orders', 'Total Spent', 'Role'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                        {c.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{c.email}</td>
                  <td className="px-5 py-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{c.orders} orders</span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-green-700">RWF {c.spent.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs capitalize">{c.role || 'customer'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
