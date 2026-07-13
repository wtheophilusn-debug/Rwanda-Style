import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  const handleWishlist = async () => {
    if (!user) { toast.error('Login to save to wishlist'); return; }
    await toggle(product._id);
    toast.success(isWishlisted(product._id) ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (!product) return <div className="text-center py-20">Loading...</div>;

  const wishlisted = isWishlisted(product._id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      <img
        src={product.image || 'https://placehold.co/500x400?text=No+Image'}
        alt={product.name}
        className="w-full rounded-xl object-cover"
      />
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <button onClick={handleWishlist}
            className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition ${wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'}`}>
            <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="text-gray-500 mt-1">{product.category?.name}</p>
        <p className="text-2xl text-green-700 font-bold mt-4">RWF {product.price.toLocaleString()}</p>
        <p className="text-gray-600 mt-4">{product.description}</p>
        <p className="text-sm mt-2 text-gray-400">Stock: {product.stock}</p>
        <button
          onClick={() => { addToCart(product); toast.success('Added to cart'); }}
          className="mt-6 bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition w-full"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
