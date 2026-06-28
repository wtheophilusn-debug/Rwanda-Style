import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useCart();

  if (cart.length === 0) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">Your cart is empty.</p>
      <Link to="/products" className="text-green-700 font-semibold hover:underline mt-4 block">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item._id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow">
            <img src={item.image || 'https://placehold.co/80x80'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-green-700">RWF {item.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item._id, item.qty - 1)} className="px-2 py-1 border rounded">-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item._id, item.qty + 1)} className="px-2 py-1 border rounded">+</button>
            </div>
            <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <span className="text-xl font-bold">Total: RWF {total.toLocaleString()}</span>
        <Link to="/checkout" className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
          Checkout
        </Link>
      </div>
    </div>
  );
}
