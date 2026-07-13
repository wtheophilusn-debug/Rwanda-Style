import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Package, CheckCheck, Trash2 } from 'lucide-react';
import api from '../../utils/api';

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / 604800)} weeks ago`;
}

function ordersToNotifications(orders) {
  const notes = [];
  orders.forEach(o => {
    const shortId = o._id.slice(-8).toUpperCase();
    if (o.status === 'delivered') {
      notes.push({ id: `${o._id}-delivered`, title: 'Order Delivered', message: `Your order #${shortId} has been delivered successfully.`, time: timeAgo(o.updatedAt), read: false });
    } else if (o.status === 'shipped') {
      notes.push({ id: `${o._id}-shipped`, title: 'Order Shipped', message: `Your order #${shortId} is on its way!`, time: timeAgo(o.updatedAt), read: false });
    } else if (o.status === 'processing') {
      notes.push({ id: `${o._id}-processing`, title: 'Order Confirmed', message: `Your order #${shortId} has been confirmed and is being processed.`, time: timeAgo(o.createdAt), read: false });
    } else if (o.status === 'pending') {
      notes.push({ id: `${o._id}-pending`, title: 'Order Placed', message: `Your order #${shortId} has been placed and is awaiting confirmation.`, time: timeAgo(o.createdAt), read: false });
    } else if (o.status === 'cancelled') {
      notes.push({ id: `${o._id}-cancelled`, title: 'Order Cancelled', message: `Your order #${shortId} has been cancelled.`, time: timeAgo(o.updatedAt), read: false });
    }
  });
  return notes;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setNotifications(ordersToNotifications(data)))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const remove = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Notifications</span>
      </nav>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          {unreadCount > 0 && <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-green-700 hover:underline">
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {['all', 'unread'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${filter === f ? 'bg-green-700 text-white' : 'bg-white border hover:border-green-700 text-gray-600'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
          <Bell size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)}
              className={`bg-white rounded-2xl shadow-sm border p-4 flex gap-4 cursor-pointer transition hover:shadow-md ${!n.read ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600">
                <Package size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                  <button onClick={(e) => { e.stopPropagation(); remove(n.id); }} className="text-gray-300 hover:text-red-400 flex-shrink-0"><Trash2 size={14} /></button>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-green-700 rounded-full mt-2 flex-shrink-0"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
