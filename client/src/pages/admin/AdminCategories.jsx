import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const load = () => api.get('/categories').then(({ data }) => setCategories(data));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name });
      toast.success('Category added'); setName(''); load();
    } catch { toast.error('Failed to add'); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/categories/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name"
          className="flex-1 border rounded-lg px-4 py-2" />
        <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-600">Add</button>
      </form>
      <div className="bg-white rounded-xl shadow divide-y">
        {categories.map((c) => (
          <div key={c._id} className="flex justify-between items-center px-4 py-3">
            <span>{c.name}</span>
            <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
