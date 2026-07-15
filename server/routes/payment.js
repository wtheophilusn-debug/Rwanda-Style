const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} = require('@paypal/paypal-server-sdk');

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  environment: process.env.PAYPAL_MODE === 'live' ? Environment.Production : Environment.Sandbox,
  logging: { logLevel: LogLevel.Info, logRequest: false, logResponse: false },
});

const ordersController = new OrdersController(client);

// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in RWF
    const usd = (amount / 1400).toFixed(2); // convert RWF to USD for PayPal
    const { body } = await ordersController.ordersCreate({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [{
          amount: { currencyCode: 'USD', value: usd },
          description: 'Rwanda Style Order',
        }],
      },
    });
    res.json({ id: body.id });
  } catch (err) {
    if (err instanceof ApiError) return res.status(err.statusCode).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payment/capture-order
router.post('/capture-order', protect, async (req, res) => {
  try {
    const { orderID } = req.body;
    const { body } = await ordersController.ordersCapture({ id: orderID });
    res.json(body);
  } catch (err) {
    if (err instanceof ApiError) return res.status(err.statusCode).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
