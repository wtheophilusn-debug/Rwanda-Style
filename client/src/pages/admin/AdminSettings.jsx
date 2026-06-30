import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ new: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.put('/auth/profile', profile); toast.success('Profile updated'); }
    catch { toast.error('Failed to update'); } finally { setSaving(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match');
    setSaving(true);
    try { await api.put('/auth/profile', { password: passwords.new }); toast.success('Password changed'); setPasswords({ new: '', confirm: '' }); }
    catch { toast.error('Failed to change password'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/admin" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Settings</span>
      </nav>

      {/* Admin Card */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center text-2xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-xl font-bold">{user?.name}</h3>
          <p className="text-gray-400">{user?.email}</p>
          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full mt-1 inline-block">Administrator</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b">
          {['profile', 'password'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-4 text-sm font-medium capitalize transition border-b-2 ${tab === t ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t === 'profile' ? 'Profile Info' : 'Change Password'}
            </button>
          ))}
        </div>
        <div className="p-6 max-w-lg">
          {tab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input value={user?.email} disabled className="w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
              </div>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 disabled:opacity-60">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
          {tab === 'password' && (
            <form onSubmit={handlePasswordSave} className="space-y-4">
              {[{ key: 'new', label: 'New Password' }, { key: 'confirm', label: 'Confirm Password' }].map(({ key, label }) => (
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
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 disabled:opacity-60">
                <Save size={16} /> {saving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
