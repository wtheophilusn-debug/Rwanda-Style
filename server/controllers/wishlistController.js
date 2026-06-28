const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name image price');
  res.json(wishlist || { products: [] });
};

const toggleWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  const index = wishlist.products.indexOf(req.params.productId);
  if (index > -1) wishlist.products.splice(index, 1);
  else wishlist.products.push(req.params.productId);
  await wishlist.save();
  res.json(wishlist);
};

module.exports = { getWishlist, toggleWishlist };
