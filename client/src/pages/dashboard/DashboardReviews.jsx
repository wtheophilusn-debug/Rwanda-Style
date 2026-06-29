import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

function Stars({ rating, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onClick={() => onRate && onRate(s)}
          onMouseEnter={() => onRate && setHover(s)}
          onMouseLeave={() => onRate && setHover(0)}
          className={onRate ? 'cursor-pointer' : 'cursor-default'}>
          <Star size={16} className={(hover || rating) >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  );
}

export default function DashboardReviews() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: '', rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=100').then(({ data }) => setProducts(data.products)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId || !form.rating) return toast.error('Select a product and rating');
    try {
      await api.post(`/products/${form.productId}/reviews`, { rating: form.rating, comment: form.comment });
      toast.success('Review submitted!');
      setForm({ productId: '', rating: 0, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    }
  };

  const selectedProduct = products.find(p => p._id === form.productId);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">My Reviews</span>
      </nav>

      {/* Write Review */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Select Product</label>
            <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700">
              <option value="">-- Choose a product --</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>

          {selectedProduct && (
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
              <img src={selectedProduct.image || 'https://placehold.co/60x60'} alt="" className="w-14 h-14 rounded-lg object-cover" />
              <div>
                <p className="font-medium text-sm">{selectedProduct.name}</p>
                <p className="text-green-700 text-sm font-semibold">RWF {selectedProduct.price.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Rating</label>
            <Stars rating={form.rating} onRate={r => setForm({ ...form, rating: r })} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Comment</label>
            <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })}
              placeholder="Share your experience with this product..."
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none" rows={4} />
          </div>

          <button type="submit" className="bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition">
            Submit Review
          </button>
        </form>
      </div>

      {/* Products with reviews */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Product Reviews</h3>
        <div className="space-y-4">
          {products.filter(p => p.reviews?.length > 0).slice(0, 5).map(p => (
            <div key={p._id} className="border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={p.image || 'https://placehold.co/50x50'} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.reviews.length} review(s)</p>
                </div>
              </div>
              {p.reviews.slice(0, 2).map(r => (
                <div key={r._id} className="bg-gray-50 rounded-xl p-3 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <Stars rating={r.rating} />
                    <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          ))}
          {products.filter(p => p.reviews?.length > 0).length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">No reviews yet. Be the first to review a product!</p>
          )}
        </div>
      </div>
    </div>
  );
}
