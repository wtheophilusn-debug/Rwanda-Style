const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const PAYPAL_API = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const usd = (amount / 1400).toFixed(2);
    const token = await getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'USD', value: usd } }],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ message: data.message || 'PayPal error' });
    res.json({ id: data.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payment/capture-order
router.post('/capture-order', protect, async (req, res) => {
  try {
    const { orderID } = req.body;
    const token = await getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ message: data.message || 'Capture failed' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
