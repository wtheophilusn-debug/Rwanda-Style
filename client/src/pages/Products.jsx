import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ui/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const search   = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort') || '';
  const page     = Number(searchParams.get('page') || 1);

  useEffect(() => {
    api.get(`/products?search=${search}&category=${category}&sort=${sort}&page=${page}`)
      .then(({ data }) => { setProducts(data.products); setTotal(data.total); });
    api.get('/categories').then(({ data }) => setCategories(data));
  }, [search, category, sort, page]);

  const set = (key, value) => {
    const p = Object.fromEntries(searchParams);
    setSearchParams({ ...p, [key]: value, page: 1 });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text" placeholder="Search products..." value={search}
          onChange={(e) => set('search', e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-48"
        />
        <select value={category} onChange={(e) => set('category', e.target.value)} className="border rounded-lg px-4 py-2">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={sort} onChange={(e) => set('sort', e.target.value)} className="border rounded-lg px-4 py-2">
          <option value="">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <p className="text-gray-500 mb-4">{total} products found</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
