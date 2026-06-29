import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function DashboardCart() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Shopping Cart</span>
      </nav>

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
          <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Your cart is empty</p>
          <Link to="/products" className="text-green-700 text-sm hover:underline mt-2 block">Browse products</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">{cart.length} Items</h3>
              <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear all</button>
            </div>
            {cart.map(item => (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4">
                <img src={item.image || 'https://placehold.co/80x80'} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm line-clamp-2">{item.name}</p>
                  <p className="text-green-700 font-bold mt-1">RWF {item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-gray-100"><Minus size={12} /></button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-gray-100"><Plus size={12} /></button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                  <p className="font-bold text-sm text-gray-800">RWF {(item.price * item.qty).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between text-gray-600">
                    <span className="truncate max-w-xs">{item.name} x{item.qty}</span>
                    <span>RWF {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-green-700">RWF {total.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')}
                className="mt-4 w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition">
                Proceed to Checkout
              </button>
              <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-green-700 mt-3">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
