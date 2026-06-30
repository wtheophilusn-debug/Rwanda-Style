import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit3, Search, Package } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const empty = { name: '', description: '', price: '', stock: '', category: '', image: null };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    Promise.all([api.get('/products?limit=100'), api.get('/categories')])
      .then(([p, c]) => { setProducts(p.data.products); setCategories(c.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') fd.append(k, v); });
    try {
      if (editing) await api.put(`/products/${editing}`, fd);
      else await api.post('/products', fd);
      toast.success(editing ? 'Product updated' : 'Product created');
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch { toast.error('Failed to save product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    toast.success('Product deleted'); setDeleteConfirm(null); load();
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category?._id || '', image: null });
    setEditing(p._id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/admin" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Products</span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2 flex-1 max-w-sm">
          <Search size={16} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="outline-none text-sm w-full" />
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(empty); }}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">{editing ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700">
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Price (RWF)</label>
              <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Stock</label>
              <input required type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Product Image</label>
              <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })}
                className="w-full border rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }}
                className="border px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{filtered.length} Products</h3>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <img src={p.image || 'https://placehold.co/50x50'} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-800 max-w-xs">
                      <p className="line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.description}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{p.category?.name}</td>
                    <td className="px-5 py-3 font-semibold text-green-700">RWF {p.price.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><Edit3 size={14} /></button>
                        <button onClick={() => setDeleteConfirm(p)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-semibold text-gray-800 mb-2">Delete Product</h3>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm._id)} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
