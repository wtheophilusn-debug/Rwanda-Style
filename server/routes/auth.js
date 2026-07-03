const router = require('express').Router();
const { register, verifyRegisterOTP, login, verifyLoginOTP, forgotPassword, resetPassword, getProfile, updateProfile, updateAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/verify-register', verifyRegisterOTP);
router.post('/login', login);
router.post('/verify-login', verifyLoginOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;
