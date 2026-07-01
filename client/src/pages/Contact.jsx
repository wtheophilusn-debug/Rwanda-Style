import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-green-700 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-green-100 text-lg">We'd love to hear from you. Send us a message!</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-5">Get In Touch</h3>
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: 'Address', value: 'Nyanza, Kigali
Rwanda' },
                  { icon: Phone, label: 'Phone', value: '+250 794 750 391' },
                  { icon: Mail, label: 'Email', value: 'stylerwanda984@gmail.com' },
                  { icon: Clock, label: 'Working Hours', value: 'Open 24 Hours / 7 Days a Week' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-green-700" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                      <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, color: 'bg-blue-600', label: 'Facebook', url: 'https://www.facebook.com/share/1FpQeiktvA/?mibextid=wwXIfr' },
                  { icon: Twitter, color: 'bg-sky-500', label: 'Twitter', url: 'https://x.com/Theophilus21989' },
                  { icon: Instagram, color: 'bg-pink-500', label: 'Instagram', url: 'https://www.instagram.com/amb_theophilus_wherd_aigar2002?igsh=MWdkN2Y4bHp3dmI1MQ==' },
                ].map(({ icon: Icon, color, label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer" className={`${color} text-white w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-80 transition`}>
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-5">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
                <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..." rows={5}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-60 transition">
                <Send size={16} /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-100 h-64 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPin size={40} className="mx-auto mb-2 text-green-700" />
              <p className="font-medium text-gray-600">Rwanda Style — Nyanza, Kigali</p>
              <p className="text-sm">Nyanza, Kigali, Rwanda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
