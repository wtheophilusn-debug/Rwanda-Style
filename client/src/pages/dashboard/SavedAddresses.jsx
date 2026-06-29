import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Trash2, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

const defaultAddresses = [
  { id: 1, label: 'Home', address: 'KG 123 St, Kigali Heights', phone: '0781234567', default: true },
  { id: 2, label: 'Office', address: 'KN 5 Rd, CBD, Kigali', phone: '0789876543', default: false },
];

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState(defaultAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', address: '', phone: '' });
  const [editId, setEditId] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (editId) {
      setAddresses(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a));
      toast.success('Address updated');
    } else {
      setAddresses(prev => [...prev, { id: Date.now(), ...form, default: false }]);
      toast.success('Address added');
    }
    setForm({ label: '', address: '', phone: '' }); setShowForm(false); setEditId(null);
  };

  const handleDelete = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success('Address removed');
  };

  const handleEdit = (a) => {
    setForm({ label: a.label, address: a.address, phone: a.phone });
    setEditId(a.id); setShowForm(true);
  };

  const setDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })));
    toast.success('Default address updated');
  };

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Saved Addresses</span>
      </nav>

      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{addresses.length} Saved Addresses</h3>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ label: '', address: '', phone: '' }); }}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600">
          <Plus size={16} /> Add Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h4 className="font-semibold text-gray-800">{editId ? 'Edit Address' : 'New Address'}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Label</label>
              <input required value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                placeholder="Home, Office..." className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
              <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="078XXXXXXX" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Address</label>
            <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              placeholder="Street, District, City" rows={2}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl shadow-sm border-2 p-5 transition ${a.default ? 'border-green-700' : 'border-gray-100'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <MapPin size={16} className="text-green-700" />
                </div>
                <span className="font-semibold text-gray-800">{a.label}</span>
                {a.default && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(a)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{a.address}</p>
            <p className="text-sm text-gray-400 mt-1">{a.phone}</p>
            {!a.default && (
              <button onClick={() => setDefault(a.id)} className="mt-3 text-xs text-green-700 hover:underline">Set as default</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
