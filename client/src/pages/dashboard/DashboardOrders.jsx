import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api';

const statusColor = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
const filters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PER_PAGE = 5;

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const downloadInvoice = (order) => {
    const content = `RWANDA STYLE - INVOICE\n${'='.repeat(40)}\nOrder ID: #${order._id.slice(-8).toUpperCase()}\nDate: ${new Date(order.createdAt).toLocaleDateString()}\nStatus: ${order.status}\n\nItems:\n${order.products.map(i => `  - ${i.product?.name} x${i.quantity} = RWF ${(i.price * i.quantity).toLocaleString()}`).join('\n')}\n\nTotal: RWF ${order.total.toLocaleString()}\nDelivery Address: ${order.address}\nPhone: ${order.phone}\n\nThank you for shopping with Rwanda Style!`;
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `invoice-${order._id.slice(-8)}.txt`; a.click();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">My Orders</span>
      </nav>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => { setFilter(f); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${filter === f ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border hover:border-green-700 hover:text-green-700'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {paginated.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
          <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No {filter !== 'all' ? filter : ''} orders found</p>
          <Link to="/products" className="text-green-700 text-sm hover:underline mt-2 block">Browse products</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>{['Order', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <p className="font-mono font-semibold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{order.products.length} item(s)</td>
                  <td className="px-5 py-4 font-semibold text-green-700">RWF {order.total.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(order)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="View"><Eye size={15} /></button>
                      <button onClick={() => downloadInvoice(order)} className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100" title="Download Invoice"><Download size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50">
              <p className="text-sm text-gray-500">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="p-1.5 rounded-lg border disabled:opacity-40 hover:bg-white"><ChevronLeft size={16} /></button>
                {Array.from({ length: pages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i+1)} className={`w-8 h-8 rounded-lg text-sm ${page===i+1 ? 'bg-green-700 text-white' : 'border hover:bg-white'}`}>{i+1}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page===pages} className="p-1.5 rounded-lg border disabled:opacity-40 hover:bg-white"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-semibold">Order #{selected._id.slice(-8).toUpperCase()}</h3>
              <button onClick={() => setSelected(null)} className="text-white/80 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span>{new Date(selected.createdAt).toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Address</span><span className="text-right max-w-xs">{selected.address}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Phone</span><span>{selected.phone}</span></div>
              <hr />
              <h4 className="font-semibold text-sm">Items</h4>
              {selected.products.map(item => (
                <div key={item._id} className="flex justify-between items-center text-sm py-1 border-b">
                  <div className="flex items-center gap-3">
                    <img src={item.product?.image || 'https://placehold.co/40x40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-gray-400">x{item.quantity}</p>
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
              <button onClick={() => downloadInvoice(selected)} className="flex-1 flex items-center justify-center gap-2 bg-green-700 text-white py-2 rounded-xl text-sm hover:bg-green-600">
                <Download size={16} /> Download Invoice
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 border py-2 rounded-xl text-sm hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
