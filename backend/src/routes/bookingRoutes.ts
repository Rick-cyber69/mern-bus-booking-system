import express from 'express';
import {
  holdSeats,
  confirmBooking,
  downloadTicketPDF,
  getUserBookings,
  getOperatorBookings,
  cancelBooking
} from '../controllers/bookingController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.post('/hold', protect, holdSeats);
router.post('/confirm', protect, confirmBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/operator-bookings', protect, authorize(UserRole.OPERATOR, UserRole.ADMIN), getOperatorBookings);
router.get('/ticket/:pnr', protect, downloadTicketPDF);
router.post('/cancel/:pnr', protect, cancelBooking);

export default router;
