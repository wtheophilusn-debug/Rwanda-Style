import { createContext, useContext, useState } from 'react';

const translations = {
  EN: {
    search: 'Search products...',
    searchBtn: 'Search',
    home: 'Home',
    shop: 'Shop',
    categories: 'Categories',
    newArrivals: 'New Arrivals',
    deals: 'Deals',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    dashboard: 'My Dashboard',
    orders: 'My Orders',
    wishlist: 'Wishlist',
    adminPanel: 'Admin Panel',
    logout: 'Logout',
    addToCart: 'Add to Cart',
    welcome: '🇷🇼 Welcome to Rwanda Style — Quality Products from Rwanda',
    freeDelivery: 'Free delivery on orders over RWF 50,000',
  },
  RW: {
    search: 'Shakisha ibicuruzwa...',
    searchBtn: 'Shakisha',
    home: 'Ahabanza',
    shop: 'Iduka',
    categories: 'Ibyiciro',
    newArrivals: 'Bishya',
    deals: 'Amangazo',
    contact: 'Twandikire',
    login: 'Injira',
    register: 'Iyandikishe',
    dashboard: 'Aho ndi',
    orders: 'Ibyo nasabye',
    wishlist: 'Ibyo nshaka',
    adminPanel: 'Ubuyobozi',
    logout: 'Sohoka',
    addToCart: 'Shyira mu gasanduku',
    welcome: '🇷🇼 Murakaza neza kuri Rwanda Style',
    freeDelivery: 'Gutumiza ubuntu ku birenzeho RWF 50,000',
  },
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState('EN');
  const t = translations[lang];
  const toggle = () => setLang(l => l === 'EN' ? 'RW' : 'EN');

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
