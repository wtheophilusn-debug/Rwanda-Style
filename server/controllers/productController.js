const Product = require('../models/Product');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

const getProducts = async (req, res) => {
  const { search, category, sort, page = 1, limit = 12 } = req.query;
  const query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  const sortOption = sort === 'price_asc' ? { price: 1 } : sort === 'price_desc' ? { price: -1 } : { createdAt: -1 };
  const products = await Product.find(query).populate('category', 'name').sort(sortOption).limit(limit).skip((page - 1) * limit);
  const total = await Product.countDocuments(query);
  res.json({ products, total, pages: Math.ceil(total / limit) });
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name').populate('reviews.user', 'name');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

const createProduct = async (req, res) => {
  let image;
  if (req.file) image = await uploadToCloudinary(req.file.buffer);
  const product = await Product.create({ ...req.body, image });
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (req.file) req.body.image = await uploadToCloudinary(req.file.buffer);
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
};

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};

const addReview = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (already) return res.status(400).json({ message: 'Already reviewed' });
  product.reviews.push({ user: req.user._id, rating: req.body.rating, comment: req.body.comment });
  await product.save();
  res.status(201).json({ message: 'Review added' });
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview };
