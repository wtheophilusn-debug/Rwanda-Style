const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTP } = require('../utils/emailService');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Step 1: Register — send OTP
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // Save user as unverified
    const user = await User.create({ name, email, password, phone, verified: false });

    // Generate and send OTP
    const otp = generateOTP();
    await OTP.deleteMany({ email, purpose: 'register' });
    await OTP.create({ email, otp, purpose: 'register', expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    await sendOTP(email, otp, 'register');

    res.status(201).json({ message: 'OTP sent to your email. Please verify.', email });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Step 2: Verify OTP after register
const verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, purpose: 'register', used: false });
    if (!record) return res.status(400).json({ message: 'OTP not found. Please register again.' });
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    await OTP.deleteMany({ email, purpose: 'register' });
    const user = await User.findOneAndUpdate({ email }, { verified: true }, { new: true });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });

    // Admin requires OTP
    if (user.role === 'admin') {
      const otp = generateOTP();
      await OTP.deleteMany({ email, purpose: 'login' });
      await OTP.create({ email, otp, purpose: 'login', expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
      await sendOTP(email, otp, 'login');
      return res.json({ message: 'OTP sent to your email', email, requireOTP: true });
    }

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, token: generateToken(user._id) });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Verify admin login OTP
const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, purpose: 'login', used: false });
    if (!record) return res.status(400).json({ message: 'OTP not found. Please login again.' });
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    await OTP.deleteMany({ email, purpose: 'login' });
    const user = await User.findOne({ email });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot password — send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const otp = generateOTP();
    await OTP.deleteMany({ email, purpose: 'reset' });
    await OTP.create({ email, otp, purpose: 'reset', expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    await sendOTP(email, otp, 'reset');

    res.json({ message: 'Password reset OTP sent to your email', email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset password with OTP
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const record = await OTP.findOne({ email, purpose: 'reset', used: false });
    if (!record) return res.status(400).json({ message: 'OTP not found. Please request again.' });
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    await OTP.deleteMany({ email, purpose: 'reset' });
    const user = await User.findOne({ email });
    user.password = password;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now login.' });
  } catch (err) {
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
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
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

module.exports = { register, verifyRegisterOTP, login, verifyLoginOTP, forgotPassword, resetPassword, getProfile, updateProfile, updateAvatar };
