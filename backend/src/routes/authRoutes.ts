import express from 'express';
import { registerUser, loginUser, getUserProfile, getOperators } from '../controllers/authController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/operators', protect, authorize(UserRole.ADMIN), getOperators);

export default router;
