import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Plus, Trash2, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const defaultCards = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/27', holder: 'Test User', default: true },
  { id: 2, type: 'Mastercard', last4: '5555', expiry: '08/26', holder: 'Test User', default: false },
];

const mobileMoney = [
  { id: 1, type: 'MTN Mobile Money', number: '078XXXXXX', default: true },
  { id: 2, type: 'Airtel Money', number: '073XXXXXX', default: false },
];

export default function PaymentMethods() {
  const [cards, setCards] = useState(defaultCards);
  const [tab, setTab] = useState('card');

  const removeCard = (id) => { setCards(prev => prev.filter(c => c.id !== id)); toast.success('Card removed'); };
  const setDefault = (id) => { setCards(prev => prev.map(c => ({ ...c, default: c.id === id }))); toast.success('Default updated'); };

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-500">
        <Link to="/dashboard" className="hover:text-green-700">Dashboard</Link> <span className="mx-2">/</span>
        <span className="text-green-700 font-medium">Payment Methods</span>
      </nav>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        {[{ key: 'card', label: 'Cards', Icon: CreditCard }, { key: 'mobile', label: 'Mobile Money', Icon: Smartphone }].map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${tab === key ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === 'card' && (
        <div className="space-y-4">
          {cards.map(card => (
            <div key={card.id} className={`bg-white rounded-2xl shadow-sm border-2 p-5 ${card.default ? 'border-green-700' : 'border-gray-100'}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold ${card.type === 'Visa' ? 'bg-blue-700' : 'bg-orange-500'}`}>
                    {card.type === 'Visa' ? 'VISA' : 'MC'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">•••• •••• •••• {card.last4}</p>
                    <p className="text-sm text-gray-400">{card.holder} · Expires {card.expiry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {card.default && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
                  <button onClick={() => removeCard(card.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              {!card.default && <button onClick={() => setDefault(card.id)} className="mt-3 text-xs text-green-700 hover:underline">Set as default</button>}
            </div>
          ))}
          <button onClick={() => toast('Card adding coming soon', { icon: '💳' })}
            className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-5 flex items-center justify-center gap-2 text-gray-400 hover:border-green-700 hover:text-green-700 transition">
            <Plus size={18} /> Add New Card
          </button>
        </div>
      )}

      {tab === 'mobile' && (
        <div className="space-y-4">
          {mobileMoney.map(m => (
            <div key={m.id} className={`bg-white rounded-2xl shadow-sm border-2 p-5 ${m.default ? 'border-green-700' : 'border-gray-100'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Smartphone size={18} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{m.type}</p>
                    <p className="text-sm text-gray-400">{m.number}</p>
                  </div>
                </div>
                {m.default && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
              </div>
            </div>
          ))}
          <button onClick={() => toast('Mobile money adding coming soon', { icon: '📱' })}
            className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-5 flex items-center justify-center gap-2 text-gray-400 hover:border-green-700 hover:text-green-700 transition">
            <Plus size={18} /> Add Mobile Money
          </button>
        </div>
      )}
    </div>
  );
}
