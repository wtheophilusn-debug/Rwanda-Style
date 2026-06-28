import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/products?limit=1'),
      api.get('/orders'),
      api.get('/categories'),
    ]).then(([p, o, c]) => {
      setStats({ products: p.data.total, orders: o.data.length, categories: c.data.length });
    });
  }, []);

  const cards = [
    { label: 'Products', value: stats.products, link: '/admin/products', color: 'bg-green-100 text-green-700' },
    { label: 'Orders', value: stats.orders, link: '/admin/orders', color: 'bg-blue-100 text-blue-700' },
    { label: 'Categories', value: stats.categories, link: '/admin/categories', color: 'bg-yellow-100 text-yellow-700' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Link key={c.label} to={c.link} className={`rounded-xl p-6 shadow text-center font-semibold ${c.color} hover:opacity-80 transition`}>
            <p className="text-4xl font-bold">{c.value}</p>
            <p className="mt-2">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
