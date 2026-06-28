import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ui/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products?limit=8').then(({ data }) => setFeatured(data.products));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-green-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Rwanda Style</h1>
        <p className="text-lg mb-8">Discover quality products from Rwanda</p>
        <Link to="/products" className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition">
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/products" className="text-green-700 font-semibold hover:underline">View All Products →</Link>
        </div>
      </section>
    </div>
  );
}
