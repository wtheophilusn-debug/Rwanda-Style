const router = require('express').Router();
const { register, login, getProfile, updateProfile, updateAvatar, getAllUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/avatar', protect, upload.single('avatar'), updateAvatar);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
