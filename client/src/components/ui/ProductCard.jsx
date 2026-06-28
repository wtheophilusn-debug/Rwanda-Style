import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    toast.success('Added to cart');
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image || 'https://placehold.co/300x200?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="font-semibold text-gray-800 hover:text-green-700 line-clamp-2">
          {product.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1">{product.category?.name}</p>
        <p className="text-green-700 font-bold mt-2">RWF {product.price.toLocaleString()}</p>
        <button
          onClick={handleAdd}
          className="mt-auto flex items-center justify-center gap-2 bg-green-700 text-white py-2 rounded-lg hover:bg-green-600 transition mt-3"
        >
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
