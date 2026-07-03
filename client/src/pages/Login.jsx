import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [step, setStep] = useState('login'); // login | otp | forgot | reset
  const [form, setForm] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [resetForm, setResetForm] = useState({ email: '', otp: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.requireOTP) {
        toast.success('OTP sent to your email!');
        setStep('otp');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        toast.success('Welcome back!');
        navigate(data.role === 'admin' ? '/admin' : '/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-login', { email: form.email, otp });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: resetForm.email });
      toast.success('OTP sent to your email!');
      setStep('reset');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not found');
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', resetForm);
      toast.success('Password reset successfully!');
      setStep('login');
      setResetForm({ email: '', otp: '', password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset');
    } finally { setLoading(false); }
  };

  if (step === 'otp') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleVerifyOTP} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <div className="text-center mb-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-green-700">Admin Verification</h1>
          <p className="text-sm text-gray-500 mt-1">OTP sent to <strong>{form.email}</strong></p>
        </div>
        <input required maxLength={6} placeholder="Enter 6-digit OTP" value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="w-full border-2 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-green-700" />
        <button type="submit" disabled={loading || otp.length !== 6}
          className="w-full bg-green-700 text-white py-2.5 rounded-xl hover:bg-green-600 font-semibold disabled:opacity-60">
          {loading ? 'Verifying...' : 'Verify & Login'}
        </button>
        <button type="button" onClick={() => setStep('login')} className="w-full text-sm text-gray-400 hover:underline">
          ← Back to Login
        </button>
      </form>
    </div>
  );

  if (step === 'forgot') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleForgot} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-green-700">Forgot Password</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset OTP</p>
        </div>
        <input required type="email" placeholder="Your email address" value={resetForm.email}
          onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
        <button type="submit" disabled={loading}
          className="w-full bg-green-700 text-white py-2.5 rounded-xl hover:bg-green-600 font-semibold disabled:opacity-60">
          {loading ? 'Sending...' : 'Send Reset OTP'}
        </button>
        <button type="button" onClick={() => setStep('login')} className="w-full text-sm text-gray-400 hover:underline">
          ← Back to Login
        </button>
      </form>
    </div>
  );

  if (step === 'reset') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-green-700">Reset Password</h1>
          <p className="text-sm text-gray-500 mt-1">Enter the OTP sent to <strong>{resetForm.email}</strong></p>
        </div>
        <input required maxLength={6} placeholder="Enter 6-digit OTP" value={resetForm.otp}
          onChange={(e) => setResetForm({ ...resetForm, otp: e.target.value.replace(/\D/g, '') })}
          className="w-full border-2 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-green-700" />
        <input required type="password" placeholder="New Password" value={resetForm.password}
          onChange={(e) => setResetForm({ ...resetForm, password: e.target.value })}
          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
        <button type="submit" disabled={loading || resetForm.otp.length !== 6}
          className="w-full bg-green-700 text-white py-2.5 rounded-xl hover:bg-green-600 font-semibold disabled:opacity-60">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-green-700">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>
        <input required type="email" placeholder="Email Address" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
        <input required type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
        <div className="text-right">
          <button type="button" onClick={() => setStep('forgot')} className="text-sm text-green-700 hover:underline">
            Forgot Password?
          </button>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-green-700 text-white py-2.5 rounded-xl hover:bg-green-600 font-semibold disabled:opacity-60">
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-center text-sm">Don't have an account? <Link to="/register" className="text-green-700 font-semibold">Register</Link></p>
      </form>
    </div>
  );
}
