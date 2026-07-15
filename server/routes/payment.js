const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { protect } = require('../middleware/auth');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/create-intent
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in RWF
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // RWF has no subunits
      currency: 'rwf',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
