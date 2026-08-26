import express from 'express';
import { createBus, getBuses, getBusById } from '../controllers/busController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.route('/')
  .post(protect, authorize(UserRole.OPERATOR, UserRole.ADMIN), createBus)
  .get(protect, getBuses);

router.route('/:id').get(protect, getBusById);

export default router;
