const Category = require('../models/Category');

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
};

const createCategory = async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json(category);
};

const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
};

module.exports = { getCategories, createCategory, deleteCategory };
