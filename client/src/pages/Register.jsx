import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-register', { email: form.email, otp });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Email verified! Welcome to Rwanda Style!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    try {
      await api.post('/auth/register', form);
      toast.success('New OTP sent!');
    } catch { toast.error('Failed to resend'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {step === 1 ? (
        <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-green-700">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Join Rwanda Style today</p>
          </div>
          <input required placeholder="Full Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
          <input required type="email" placeholder="Email Address" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
          <input placeholder="Phone Number" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
          <input required type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
          <button type="submit" disabled={loading}
            className="w-full bg-green-700 text-white py-2.5 rounded-xl hover:bg-green-600 font-semibold disabled:opacity-60">
            {loading ? 'Sending OTP...' : 'Register'}
          </button>
          <p className="text-center text-sm">Already have an account? <Link to="/login" className="text-green-700 font-semibold">Login</Link></p>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
          <div className="text-center mb-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">📧</span>
            </div>
            <h1 className="text-2xl font-bold text-green-700">Verify Your Email</h1>
            <p className="text-sm text-gray-500 mt-1">We sent a 6-digit code to</p>
            <p className="text-sm font-semibold text-gray-800">{form.email}</p>
          </div>
          <input required maxLength={6} placeholder="Enter 6-digit OTP" value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full border-2 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-green-700" />
          <button type="submit" disabled={loading || otp.length !== 6}
            className="w-full bg-green-700 text-white py-2.5 rounded-xl hover:bg-green-600 font-semibold disabled:opacity-60">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
          <div className="text-center space-y-2">
            <button type="button" onClick={handleResend} className="text-sm text-green-700 hover:underline">
              Resend OTP
            </button>
            <br />
            <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-400 hover:underline">
              ← Back to Register
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
