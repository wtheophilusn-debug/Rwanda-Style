import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      <img
        src={product.image || 'https://placehold.co/500x400?text=No+Image'}
        alt={product.name}
        className="w-full rounded-xl object-cover"
      />
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-gray-500 mt-1">{product.category?.name}</p>
        <p className="text-2xl text-green-700 font-bold mt-4">RWF {product.price.toLocaleString()}</p>
        <p className="text-gray-600 mt-4">{product.description}</p>
        <p className="text-sm mt-2 text-gray-400">Stock: {product.stock}</p>
        <button
          onClick={() => { addToCart(product); toast.success('Added to cart'); }}
          className="mt-6 bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition w-full"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
