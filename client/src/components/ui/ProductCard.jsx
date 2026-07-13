import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { user } = useAuth();
  const { t } = useLang();
  const wishlisted = isWishlisted(product._id);

  const handleAdd = () => {
    addToCart(product);
    toast.success('Added to cart');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to save wishlist'); return; }
    await toggle(product._id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col relative">
      {/* Wishlist button */}
      <button onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow flex items-center justify-center hover:scale-110 transition">
        <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
      </button>

      <Link to={`/products/${product._id}`}>
        <img
          src={product.image || 'https://placehold.co/300x200?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="font-semibold text-gray-800 dark:text-gray-100 hover:text-green-700 line-clamp-2">
          {product.name}
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.category?.name}</p>
        <p className="text-green-700 font-bold mt-2">RWF {product.price.toLocaleString()}</p>
        <button
          onClick={handleAdd}
          className="mt-3 flex items-center justify-center gap-2 bg-green-700 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          <ShoppingCart size={16} /> {t.addToCart}
        </button>
      </div>
    </div>
  );
}
