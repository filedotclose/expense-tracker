const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const authSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

router.post('/register', validateRequest(authSchema), registerUser);
router.post('/login', validateRequest(authSchema), loginUser);
router.get('/me', protect, getMe);

module.exports = router;
