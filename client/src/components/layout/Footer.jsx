import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🇷🇼</span>
            <span className="text-2xl font-bold text-white">Rwanda Style</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Your one-stop shop for quality products delivered right to your doorstep. Discover authentic Rwandan products crafted with love and tradition.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="https://www.facebook.com/share/1FpQeiktvA/?mibextid=wwXIfr" target="_blank" rel="noreferrer"
              className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center hover:opacity-80 transition">
              <Facebook size={16} className="text-white" />
            </a>
            <a href="https://x.com/Theophilus21989" target="_blank" rel="noreferrer"
              className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center hover:opacity-80 transition">
              <Twitter size={16} className="text-white" />
            </a>
            <a href="https://www.instagram.com/amb_theophilus_wherd_aigar2002?igsh=MWdkN2Y4bHp3dmI1MQ==" target="_blank" rel="noreferrer"
              className="w-9 h-9 bg-pink-500 rounded-lg flex items-center justify-center hover:opacity-80 transition">
              <Instagram size={16} className="text-white" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'Shop', to: '/products' },
              { label: 'Login', to: '/login' },
              { label: 'Register', to: '/register' },
              { label: 'Help Center', to: '/contact' },
              { label: 'Contact', to: '/contact' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-sm text-gray-400 hover:text-green-400 transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Phone size={15} className="text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-400">+250 794 750 391</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={15} className="text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-400">stylerwanda984@gmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={15} className="text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-400">Busasamana, Nyanza,<br />Kigali, Rwanda</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© 2026 Rwanda Style. All rights reserved.</p>
          <p className="text-xs text-gray-500">Built with ❤️ in Rwanda</p>
        </div>
      </div>
    </footer>
  );
}
