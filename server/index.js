require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'https://rwanda-style.vercel.app',
  process.env.CLIENT_URL,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/wishlist',   require('./routes/wishlist'));
app.use('/api/contact',    require('./routes/contact'));
app.use('/api/ai',         require('./routes/ai'));
app.use('/api/payment',    require('./routes/payment'));

app.get('/', (req, res) => res.json({ message: 'Rwanda Style API running' }));

app.use((req, res) => res.status(404).json({ message: `Route ${req.path} not found` }));

app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
