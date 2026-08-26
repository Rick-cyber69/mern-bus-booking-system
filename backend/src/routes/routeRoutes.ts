import express from 'express';
import { createRoute, getRoutes, getCities } from '../controllers/routeController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.get('/cities', getCities);
router.route('/')
  .post(protect, authorize(UserRole.ADMIN, UserRole.OPERATOR), createRoute)
  .get(getRoutes);

export default router;
