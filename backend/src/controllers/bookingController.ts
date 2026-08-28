import { Response } from 'express';
import { Booking, PaymentStatus, BookingStatus } from '../models/Booking';
import { Schedule } from '../models/Schedule';
import { Bus } from '../models/Bus';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { lockSeats, unlockSeats } from '../services/redisService';
import { generateQRCode } from '../services/qrService';
import { generatePDFTicket } from '../services/pdfService';
import { getIO } from '../services/socketService';
import { sendTicketEmail } from '../services/emailService';

const generatePNR = (): string => {
  return 'BUS' + Math.floor(10000000 + Math.random() * 90000000).toString();
};

export const holdSeats = async (req: AuthRequest, res: Response) => {
  try {
    const { scheduleId, seatNumbers } = req.body;
    const userId = req.user?._id.toString();

    if (!scheduleId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ success: false, message: 'Schedule ID and seat numbers are required' });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    // Check if any seat is already booked
    const alreadyBooked = seatNumbers.filter((s) => schedule.bookedSeats.includes(s));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats ${alreadyBooked.join(', ')} are already permanently booked.`
      });
    }

    // Attempt Redis hold lock
    const lockResult = await lockSeats(scheduleId, seatNumbers, userId!);

    if (!lockResult.success) {
      return res.status(409).json({
        success: false,
        message: 'Some of the selected seats are currently held by another passenger. Please select alternative seats.'
      });
    }

    // Broadcast seat locked status to all live clients viewing this schedule
    try {
      getIO().to(`schedule_${scheduleId}`).emit('seats_locked', {
        scheduleId,
        seatNumbers,
        lockedBy: userId
      });
    } catch {
      // Non-fatal if websocket not connected
    }

    res.json({
      success: true,
      message: 'Seats held successfully for 10 minutes',
      lockedSeats: lockResult.lockedSeats,
      expiresInSeconds: 600
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { scheduleId, passengers, paymentMethod } = req.body;
    const userId = req.user?._id;

    if (!scheduleId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking request parameters' });
    }

    const schedule = await Schedule.findById(scheduleId).populate('busId routeId');
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    const requestedSeats = passengers.map((p: any) => p.seatNumber);

    // Calculate total price
    let totalAmount = 0;
    for (const seat of requestedSeats) {
      const customPrice = schedule.seatPrices?.get(seat);
      totalAmount += customPrice || schedule.baseFare;
    }

    // Generate Unique PNR
    const pnr = generatePNR();

    // Generate encrypted payload for QR Verification
    const qrPayload = JSON.stringify({
      pnr,
      scheduleId,
      seats: requestedSeats,
      passengerCount: passengers.length,
      timestamp: Date.now()
    });

    const qrCodeData = await generateQRCode(qrPayload);

    // Create Booking Document
    const booking = await Booking.create({
      pnr,
      userId,
      scheduleId,
      passengers,
      seatNumbers: requestedSeats,
      totalAmount,
      paymentStatus: PaymentStatus.PAID,
      bookingStatus: BookingStatus.CONFIRMED,
      qrCodeData
    });

    // Mark seats as permanently booked in Schedule
    schedule.bookedSeats.push(...requestedSeats);
    await schedule.save();

    // Release Redis Hold Lock
    await unlockSeats(scheduleId, requestedSeats);

    // Broadcast seat status update to all connected clients
    try {
      getIO().to(`schedule_${scheduleId}`).emit('seats_booked', {
        scheduleId,
        seatNumbers: requestedSeats
      });
    } catch {}

    // Fire-and-forget: Send PDF ticket email to passenger (non-blocking)
    (async () => {
      try {
        const user = await User.findById(userId).select('name email');
        if (!user?.email) return;

        const populatedSchedule = await Schedule.findById(scheduleId).populate({
          path: 'busId',
          populate: { path: 'operatorId', select: 'operatorName' }
        }).populate('routeId');

        const sched: any = populatedSchedule;
        const bus: any = sched?.busId;
        const route: any = sched?.routeId;

        const bookingDataForPdf = {
          pnr,
          origin: route?.originCity || 'N/A',
          destination: route?.destinationCity || 'N/A',
          operatorName: bus?.operatorId?.operatorName || 'Express Bus System',
          busType: bus?.busType || 'AC Sleeper',
          departureTime: sched?.departureTime || new Date(),
          seatNumbers: requestedSeats,
          totalAmount,
          bookingStatus: BookingStatus.CONFIRMED,
          passengers
        };

        const pdfBuffer = await generatePDFTicket(bookingDataForPdf, qrCodeData);

        await sendTicketEmail(
          {
            recipientEmail: user.email,
            recipientName: user.name,
            pnr,
            origin: route?.originCity || 'N/A',
            destination: route?.destinationCity || 'N/A',
            departureTime: sched?.departureTime || new Date(),
            seatNumbers: requestedSeats,
            totalAmount,
            operatorName: bus?.operatorId?.operatorName || 'Express Bus System',
            busType: bus?.busType || 'AC Sleeper'
          },
          pdfBuffer
        );
      } catch (emailErr: any) {
        console.error('[Email] Background dispatch error:', emailErr.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadTicketPDF = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findOne({ pnr: req.params.pnr }).populate({
      path: 'scheduleId',
      populate: [
        { path: 'busId', populate: { path: 'operatorId', select: 'operatorName' } },
        { path: 'routeId' }
      ]
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking ticket not found' });
    }

    const schedule: any = booking.scheduleId;
    const bus: any = schedule?.busId;
    const route: any = schedule?.routeId;

    const bookingData = {
      pnr: booking.pnr,
      origin: route?.originCity || 'N/A',
      destination: route?.destinationCity || 'N/A',
      operatorName: bus?.operatorId?.operatorName || 'Express Bus System',
      busType: bus?.busType || 'AC Sleeper',
      departureTime: schedule?.departureTime || new Date(),
      seatNumbers: booking.seatNumbers,
      totalAmount: booking.totalAmount,
      bookingStatus: booking.bookingStatus,
      passengers: booking.passengers
    };

    const pdfBuffer = await generatePDFTicket(bookingData, booking.qrCodeData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Ticket-${booking.pnr}.pdf"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.user?._id })
      .populate({
        path: 'scheduleId',
        populate: [
          { path: 'busId', select: 'name busNumber busType' },
          { path: 'routeId', select: 'originCity destinationCity' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOperatorBookings = async (req: AuthRequest, res: Response) => {
  try {
    const operatorId = req.user?._id;

    // Find operator's buses
    const operatorBuses = await Bus.find({ operatorId });
    const busIds = operatorBuses.map((b) => b._id);

    // Find schedules for those buses
    const operatorSchedules = await Schedule.find({ busId: { $in: busIds } });
    const scheduleIds = operatorSchedules.map((s) => s._id);

    const query = req.user?.role === 'ADMIN' ? {} : { scheduleId: { $in: scheduleIds } };

    const bookings = await Booking.find(query)
      .populate({
        path: 'scheduleId',
        populate: [
          { path: 'busId', select: 'name busNumber busType' },
          { path: 'routeId', select: 'originCity destinationCity estimatedMinutes' }
        ]
      })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findOne({ pnr: req.params.pnr, userId: req.user?._id });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.bookingStatus === BookingStatus.CANCELLED) {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.bookingStatus = BookingStatus.CANCELLED;
    booking.paymentStatus = PaymentStatus.REFUNDED;
    await booking.save();

    // Release booked seats in schedule
    const schedule = await Schedule.findById(booking.scheduleId);
    if (schedule) {
      schedule.bookedSeats = schedule.bookedSeats.filter((s) => !booking.seatNumbers.includes(s));
      await schedule.save();

      try {
        getIO().to(`schedule_${schedule._id}`).emit('seats_freed', {
          scheduleId: schedule._id,
          seatNumbers: booking.seatNumbers
        });
      } catch {}
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Refund has been processed.',
      booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
