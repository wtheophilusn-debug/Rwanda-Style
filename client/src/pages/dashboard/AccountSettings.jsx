import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Eye, EyeOff, Save, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AccountSettings() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [preview, setPreview] = useState(user?.avatar || null);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const fileRef = useRef();

  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const { data } = await api.put('/auth/profile/avatar', fd);
      toast.success('Profile photo updated');
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      stored.avatar = data.avatar;
      localStorage.setItem('user', JSON.stringify(stored));
    } catch {
      toast.error('Failed to upload photo');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', { name: profile.name, phone: profile.phone });
      toast.success('Profile updated successfully');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error('New passwords do not match');
    if (passwords.new.length < 6) return toast.error('Password must be at least 6 characters');
    setSaving(true);
    try {
      await api.put('/auth/profile', { password: passwords.new });
      toast.success('Password changed successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch { toast.error('Failed to change password'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { key: 'profile', label: 'Profile Info' },
    { key: 'password', label: 'Change Password' },
    { key: 'security', label: 'Security' },
  ];

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Account Settings</span>
      </nav>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-green-700 text-white flex items-center justify-center text-3xl font-bold overflow-hidden">
              {preview ? <img src={preview} alt="avatar" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
            </div>
            <button onClick={() => fileRef.current.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-700 text-white rounded-full flex items-center justify-center shadow hover:bg-green-600">
              <Camera size={13} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-6 py-4 text-sm font-medium transition border-b-2 ${tab === t.key ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <input value={profile.email} disabled
                  className="w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="078XXXXXXX"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
              </div>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 disabled:opacity-60 transition">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {tab === 'password' && (
            <form onSubmit={handlePasswordSave} className="space-y-4 max-w-lg">
              {[
                { key: 'current', label: 'Current Password' },
                { key: 'new', label: 'New Password' },
                { key: 'confirm', label: 'Confirm New Password' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
                  <div className="relative">
                    <input type={showPass[key] ? 'text' : 'password'} value={passwords[key]}
                      onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 pr-10" />
                    <button type="button" onClick={() => setShowPass(p => ({ ...p, [key]: !p[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
                Password must be at least 6 characters long
              </div>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 disabled:opacity-60 transition">
                <Save size={16} /> {saving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div className="space-y-4 max-w-lg">
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <Shield size={20} className="text-green-700 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Account Protected</p>
                  <p className="text-sm text-gray-500 mt-0.5">Your account is secured with JWT authentication and bcrypt password hashing.</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Last Login', value: new Date().toLocaleString() },
                  { label: 'Account Type', value: user?.role === 'admin' ? 'Administrator' : 'Customer' },
                  { label: 'Two-Factor Auth', value: 'Not enabled' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-3 border-b text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
