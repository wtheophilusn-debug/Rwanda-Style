import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', phone: '' });
  const [formReady, setFormReady] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormReady(true);
    toast.success('Details saved — complete payment below');
  };

  const createOrder = async () => {
    const { data } = await api.post('/payment/create-order', { amount: total });
    return data.id;
  };

  const onApprove = async (data) => {
    try {
      await api.post('/payment/capture-order', { orderID: data.orderID });
      await api.post('/orders', {
        products: cart.map((i) => ({ product: i._id, quantity: i.qty, price: i.price })),
        total,
        address: form.address,
        phone: form.phone,
        paymentId: data.orderID,
      });
      clearCart();
      toast.success('Payment successful! Order placed 🎉');
      navigate('/orders');
    } catch {
      toast.error('Failed to save order after payment');
    }
  };

  return (
    <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: 'USD' }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold mb-3 dark:text-white">Order Summary</h2>
          {cart.map((i) => (
            <div key={i._id} className="flex justify-between text-sm py-1 border-b dark:border-gray-700 dark:text-gray-300">
              <span>{i.name} x{i.qty}</span>
              <span>RWF {(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <p className="font-bold mt-3 text-right dark:text-white">
            Total: RWF {total.toLocaleString()} <span className="text-gray-400 font-normal text-sm">(≈ ${(total / 1400).toFixed(2)} USD)</span>
          </p>
        </div>

        {/* Delivery Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold mb-4 dark:text-white">Delivery Information</h2>
          {!formReady ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Delivery Address</label>
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Phone Number</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. 078XXXXXXX"
                />
              </div>
              <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold">
                Continue to Payment
              </button>
            </form>
          ) : (
            <div className="text-sm dark:text-gray-300 space-y-1">
              <p>📍 <strong>Address:</strong> {form.address}</p>
              <p>📞 <strong>Phone:</strong> {form.phone}</p>
              <button onClick={() => setFormReady(false)} className="text-green-600 text-xs underline mt-1">Edit</button>
            </div>
          )}
        </div>

        {/* PayPal Buttons */}
        {formReady && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="font-semibold mb-4 dark:text-white">Pay with PayPal</h2>
            <PayPalButtons
              style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={() => toast.error('PayPal payment failed. Please try again.')}
            />
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
}
