import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import api from '../../utils/api';

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! 👋 I\'m your Rwanda Style shopping assistant. Ask me about products, prices, or your orders!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: msg });
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unknown error';
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-green-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Rwanda Style AI</p>
                <p className="text-green-200 text-xs">Shopping Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'ai' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {m.role === 'ai' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'ai' ? 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm' : 'bg-green-700 text-white rounded-tr-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-gray-100 px-3 py-2 rounded-2xl rounded-tl-sm">
                  <Loader2 size={16} className="text-green-700 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about products..."
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-green-500"
            />
            <button onClick={send} disabled={!input.trim() || loading}
              className="w-9 h-9 bg-green-700 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition disabled:opacity-40">
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button onClick={() => setOpen(o => !o)}
        className="w-14 h-14 bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition hover:scale-105">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
