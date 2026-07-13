const router = require('express').Router();
const { chat } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// optionalAuth — attach user if token present, but don't block if not
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = require('../models/User');
    User.findById(decoded.id).select('-password').then(user => {
      req.user = user;
      next();
    }).catch(() => next());
  } catch {
    next();
  }
};

router.post('/chat', optionalAuth, chat);

module.exports = router;
