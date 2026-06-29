import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function DashboardWishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const load = () => api.get('/wishlist').then(({ data }) => setProducts(data.products || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const remove = async (productId) => {
    await api.post(`/wishlist/${productId}`);
    toast.success('Removed from wishlist');
    load();
  };

  const handleAddToCart = (product) => { addToCart(product); toast.success('Added to cart'); };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Wishlist</span>
      </nav>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">{products.length} Saved Items</h2>
        <Link to="/products" className="text-sm text-green-700 hover:underline">Continue Shopping</Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
          <Heart size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Your wishlist is empty</p>
          <Link to="/products" className="text-green-700 text-sm hover:underline mt-2 block">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="relative">
                <Link to={`/products/${p._id}`}>
                  <img src={p.image || 'https://placehold.co/300x200'} alt={p.name} className="w-full h-44 object-cover" />
                </Link>
                <button onClick={() => remove(p._id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/products/${p._id}`} className="font-medium text-gray-800 hover:text-green-700 text-sm line-clamp-2">{p.name}</Link>
                <p className="text-green-700 font-bold mt-2">RWF {p.price.toLocaleString()}</p>
                <button onClick={() => handleAddToCart(p)}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-green-700 text-white py-2 rounded-xl text-sm hover:bg-green-600 transition">
                  <ShoppingCart size={15} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
