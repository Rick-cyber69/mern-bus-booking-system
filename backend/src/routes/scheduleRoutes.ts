import express from 'express';
import {
  createSchedule,
  searchSchedules,
  getScheduleDetails,
  getOperatorServices
} from '../controllers/scheduleController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.get('/search', searchSchedules);
router.get('/operator-services', protect, authorize(UserRole.OPERATOR, UserRole.ADMIN), getOperatorServices);
router.get('/:id', getScheduleDetails);
router.post('/', protect, authorize(UserRole.OPERATOR, UserRole.ADMIN), createSchedule);

export default router;
