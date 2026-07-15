import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [form, setForm] = useState({ address: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      // 1. Create payment intent
      const { data } = await api.post('/payment/create-intent', { amount: total });

      // 2. Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. Place order
        await api.post('/orders', {
          products: cart.map((i) => ({ product: i._id, quantity: i.qty, price: i.price })),
          total,
          address: form.address,
          phone: form.phone,
          paymentId: paymentIntent.id,
        });
        clearCart();
        toast.success('Payment successful! Order placed 🎉');
        navigate('/orders');
      }
    } catch {
      toast.error('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Delivery Address</label>
        <input
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter your address"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="e.g. 078XXXXXXX"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Card Details</label>
        <div className="border rounded-lg px-4 py-3 dark:bg-gray-700 dark:border-gray-600">
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#374151' } } }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">Test card: 4242 4242 4242 4242 · Any future date · Any CVC</p>
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay RWF ${total.toLocaleString()}`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { cart, total } = useCart();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Checkout</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold mb-3 dark:text-white">Order Summary</h2>
        {cart.map((i) => (
          <div key={i._id} className="flex justify-between text-sm py-1 border-b dark:border-gray-700 dark:text-gray-300">
            <span>{i.name} x{i.qty}</span>
            <span>RWF {(i.price * i.qty).toLocaleString()}</span>
          </div>
        ))}
        <p className="font-bold mt-3 text-right dark:text-white">Total: RWF {total.toLocaleString()}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
