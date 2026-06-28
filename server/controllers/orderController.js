const Order = require('../models/Order');

const createOrder = async (req, res) => {
  const { products, total, address, phone } = req.body;
  const order = await Order.create({ user: req.user._id, products, total, address, phone });
  res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('products.product', 'name image price').sort({ createdAt: -1 });
  res.json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').populate('products.product', 'name').sort({ createdAt: -1 });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status;
  await order.save();
  res.json(order);
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
