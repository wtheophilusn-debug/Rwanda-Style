import { useEffect, useState } from 'react';
import api from '../utils/api';

const statusColor = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data));
  }, []);

  if (orders.length === 0) return <div className="text-center py-20 text-gray-500">No orders yet.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor[order.status]}`}>
                {order.status}
              </span>
            </div>
            {order.products.map((item) => (
              <div key={item._id} className="flex gap-3 items-center py-2 border-b text-sm">
                <img src={item.product?.image || 'https://placehold.co/50x50'} alt="" className="w-10 h-10 object-cover rounded" />
                <span>{item.product?.name}</span>
                <span className="ml-auto">x{item.quantity} — RWF {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <p className="font-bold text-right mt-3">Total: RWF {order.total.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
