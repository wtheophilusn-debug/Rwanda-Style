const fetch = require('node-fetch');
const Product = require('../models/Product');
const Order = require('../models/Order');

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const [products, orders] = await Promise.all([
      Product.find().populate('category', 'name').select('name price category stock description').limit(50).lean(),
      req.user ? Order.find({ user: req.user._id }).select('status total createdAt').sort({ createdAt: -1 }).limit(10).lean() : Promise.resolve([]),
    ]);

    const productList = products.map(p =>
      `- ${p.name} | RWF ${p.price.toLocaleString()} | Category: ${p.category?.name || 'N/A'} | Stock: ${p.stock}`
    ).join('\n');

    const orderList = orders.length
      ? orders.map(o => `- Order #${o._id.toString().slice(-8).toUpperCase()} | Status: ${o.status} | Total: RWF ${o.total.toLocaleString()} | Date: ${new Date(o.createdAt).toLocaleDateString()}`).join('\n')
      : 'No orders yet.';

    const systemPrompt = `You are a helpful shopping assistant for Rwanda Style, a Rwandan e-commerce platform selling authentic Rwandan products like Kitenge, Agaseke baskets, and more.

Available products:
${productList}

${req.user ? `Customer's recent orders:\n${orderList}` : ''}

App pages and their routes:
- Shop / Products: /products
- Cart: /cart
- My Orders: /dashboard/orders
- Wishlist: /dashboard/wishlist
- Dashboard: /dashboard
- Login: /login
- Register: /register
- Contact: /contact

Rules:
- Answer only questions related to shopping, products, orders, or the Rwanda Style store.
- Be friendly, concise, and helpful.
- Recommend products from the list above when relevant.
- Format prices in RWF.
- If asked something unrelated to shopping, politely redirect to shopping topics.
- If the user wants to navigate somewhere (e.g. "take me to shop", "go to cart", "show my orders"), end your reply with exactly this on a new line: NAVIGATE:/the-route
- Only include one NAVIGATE: line per response, and only when navigation is clearly requested.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', JSON.stringify(data));
      return res.status(500).json({ message: data?.error?.message || 'AI service unavailable' });
    }

    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Extract navigation route if AI included one
    const navMatch = reply.match(/NAVIGATE:([\/\w-]+)/);
    const navigate = navMatch ? navMatch[1] : null;
    const cleanReply = reply.replace(/NAVIGATE:([\/\w-]+)/, '').trim();

    res.json({ reply: cleanReply, navigate });
  } catch (err) {
    console.error('AI chat error:', err.message);
    res.status(500).json({ message: err.message || 'AI service unavailable' });
  }
};

module.exports = { chat };
