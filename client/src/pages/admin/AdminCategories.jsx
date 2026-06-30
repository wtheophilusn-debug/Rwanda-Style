import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Tag } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => api.get('/categories').then(({ data }) => setCategories(data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try { await api.post('/categories', { name }); toast.success('Category added'); setName(''); load(); }
    catch { toast.error('Failed to add category'); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/categories/${id}`);
    toast.success('Category deleted'); setDeleteConfirm(null); load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/admin" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Categories</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Add Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="font-semibold text-gray-800 mb-4">Add Category</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Electronics"
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600">
              <Plus size={16} /> Add Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold text-gray-800">{categories.length} Categories</h3>
          </div>
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No categories yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {categories.map((c, i) => (
                <div key={c._id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700 text-xs font-bold">{i + 1}</div>
                    <span className="font-medium text-gray-800">{c.name}</span>
                  </div>
                  <button onClick={() => setDeleteConfirm(c)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-semibold text-gray-800 mb-2">Delete Category</h3>
            <p className="text-sm text-gray-500 mb-4">Delete <strong>{deleteConfirm.name}</strong>? Products in this category will lose their category.</p>
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
