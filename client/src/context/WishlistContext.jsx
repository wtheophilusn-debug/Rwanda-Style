import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const load = useCallback(async () => {
    if (!user) { setWishlistIds(new Set()); return; }
    try {
      const { data } = await api.get('/wishlist');
      setWishlistIds(new Set((data.products || []).map(p => p._id)));
    } catch { setWishlistIds(new Set()); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (productId) => {
    await api.post(`/wishlist/${productId}`);
    setWishlistIds(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  const isWishlisted = (productId) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggle, isWishlisted, reload: load }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
