import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, Truck, MapPin, Clock } from 'lucide-react';
import api from '../../utils/api';

const steps = ['pending', 'processing', 'shipped', 'delivered'];
const stepLabels = { pending: 'Order Placed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered' };
const stepIcons = { pending: Clock, processing: Package, shipped: Truck, delivered: CheckCircle };

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => {
      const active = data.filter(o => o.status !== 'cancelled');
      setOrders(active);
      if (active.length > 0) setSelected(active[0]);
    }).finally(() => setLoading(false));
  }, []);

  const currentStep = selected ? steps.indexOf(selected.status) : 0;

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Order Tracking</span>
      </nav>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
          <Package size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No active orders to track</p>
          <Link to="/products" className="text-green-700 text-sm hover:underline mt-2 block">Start shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">Select Order</h3>
            {orders.map(order => (
              <button key={order._id} onClick={() => setSelected(order)}
                className={`w-full text-left p-3 rounded-xl border transition ${selected?._id === order._id ? 'border-green-700 bg-green-50' : 'hover:border-gray-300'}`}>
                <p className="font-mono text-sm font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-green-700 font-semibold mt-1">RWF {order.total.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Tracking Details */}
          {selected && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-800">Order #{selected._id.slice(-8).toUpperCase()}</h3>
                    <p className="text-sm text-gray-400 mt-1">{selected.products.length} item(s)</p>
                  </div>
                  <span className="text-lg font-bold text-green-700">RWF {selected.total.toLocaleString()}</span>
                </div>

                {/* Progress Steps */}
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
                    <div className="h-full bg-green-700 transition-all duration-500"
                      style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
                  </div>
                  <div className="relative z-10 flex justify-between">
                    {steps.map((step, i) => {
                      const Icon = stepIcons[step];
                      const done = i <= currentStep;
                      return (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                            ${done ? 'bg-green-700 border-green-700 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                            <Icon size={18} />
                          </div>
                          <span className={`text-xs font-medium text-center ${done ? 'text-green-700' : 'text-gray-400'}`}>
                            {stepLabels[step]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-8 bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                  <MapPin size={18} className="text-green-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Delivery Address</p>
                    <p className="text-sm text-gray-500">{selected.address}</p>
                    <p className="text-sm text-gray-500">{selected.phone}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h4 className="font-semibold text-gray-800 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selected.products.map(item => (
                    <div key={item._id} className="flex items-center gap-4">
                      <img src={item.product?.image || 'https://placehold.co/60x60'} alt="" className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product?.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-700">RWF {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
