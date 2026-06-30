import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColor = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
const filters = ['all', ...statuses];
const PER_PAGE = 8;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
    toast.success('Status updated');
  };

  const downloadInvoice = (order) => {
    const content = `RWANDA STYLE - INVOICE\n${'='.repeat(40)}\nOrder: #${order._id.slice(-8).toUpperCase()}\nDate: ${new Date(order.createdAt).toLocaleDateString()}\nCustomer: ${order.user?.name}\nEmail: ${order.user?.email}\nStatus: ${order.status}\n\nItems:\n${order.products.map(i => `  - ${i.product?.name} x${i.quantity} = RWF ${(i.price * i.quantity).toLocaleString()}`).join('\n')}\n\nTotal: RWF ${order.total.toLocaleString()}\nAddress: ${order.address}\nPhone: ${order.phone}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `invoice-${order._id.slice(-8)}.txt`; a.click();
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter;
    const matchSearch = !search || o._id.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/admin" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Orders</span>
      </nav>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${filter === f ? 'bg-green-700 text-white' : 'bg-white border hover:border-green-700 text-gray-600'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2">
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search orders..." className="outline-none text-sm w-48" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-800">{filtered.length} Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>{['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-800">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{order.user?.name || 'Customer'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{order.products.length}</td>
                  <td className="px-5 py-3 font-semibold text-green-700">RWF {order.total.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-semibold border-0 cursor-pointer ${statusColor[order.status]}`}>
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(order)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><Eye size={14} /></button>
                      <button onClick={() => downloadInvoice(order)} className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"><Download size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-500">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-1.5 rounded-lg border disabled:opacity-40"><ChevronLeft size={16} /></button>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i+1)} className={`w-8 h-8 rounded-lg text-sm ${page===i+1 ? 'bg-green-700 text-white' : 'border hover:bg-white'}`}>{i+1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page===pages} className="p-1.5 rounded-lg border disabled:opacity-40"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-semibold">Order #{selected._id.slice(-8).toUpperCase()}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Customer', selected.user?.name],
                  ['Email', selected.user?.email],
                  ['Phone', selected.phone],
                  ['Date', new Date(selected.createdAt).toLocaleString()],
                  ['Address', selected.address],
                  ['Status', selected.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-gray-400 text-xs">{label}</p>
                    <p className="font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              <hr />
              <h4 className="font-semibold">Items</h4>
              {selected.products.map(item => (
                <div key={item._id} className="flex justify-between items-center py-1 border-b">
                  <div className="flex items-center gap-3">
                    <img src={item.product?.image || 'https://placehold.co/40x40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-xs">{item.product?.name}</p>
                      <p className="text-gray-400 text-xs">x{item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-700">RWF {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span><span className="text-green-700">RWF {selected.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3">
              <button onClick={() => downloadInvoice(selected)} className="flex-1 bg-green-700 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-600 flex items-center justify-center gap-2">
                <Download size={15} /> Download Invoice
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 border py-2 rounded-xl text-sm hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
