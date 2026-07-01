const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });
    const uploadToCloudinary = require('../utils/uploadToCloudinary');
    const url = await uploadToCloudinary(req.file.buffer, 'rwanda-style/avatars');
    const user = await User.findById(req.user._id);
    user.avatar = url;
    await user.save();
    res.json({ avatar: url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, updateAvatar };
