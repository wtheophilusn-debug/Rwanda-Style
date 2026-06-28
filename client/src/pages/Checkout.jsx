import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/orders', {
        products: cart.map((i) => ({ product: i._id, quantity: i.qty, price: i.price })),
        total,
        address: form.address,
        phone: form.phone,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {cart.map((i) => (
          <div key={i._id} className="flex justify-between text-sm py-1 border-b">
            <span>{i.name} x{i.qty}</span>
            <span>RWF {(i.price * i.qty).toLocaleString()}</span>
          </div>
        ))}
        <p className="font-bold mt-3 text-right">Total: RWF {total.toLocaleString()}</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Address</label>
          <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border rounded-lg px-4 py-2" placeholder="Enter your address" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded-lg px-4 py-2" placeholder="e.g. 078XXXXXXX" />
        </div>
        <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold">
          Place Order
        </button>
      </form>
    </div>
  );
}
