import { Request, Response } from 'express';
import { Schedule } from '../models/Schedule';
import { Route } from '../models/Route';
import { Bus } from '../models/Bus';
import { Booking } from '../models/Booking';
import { getLockedSeats } from '../services/redisService';
import { AuthRequest } from '../middleware/authMiddleware';

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { busId, routeId, departureTime, arrivalTime, baseFare, seatPrices } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    const schedule = await Schedule.create({
      busId,
      routeId,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      baseFare,
      seatPrices: seatPrices || {},
      bookedSeats: []
    });

    res.status(201).json({ success: true, schedule });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchSchedules = async (req: Request, res: Response) => {
  try {
    const { origin, destination, date } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: 'Origin and destination are required' });
    }

    const routes = await Route.find({
      originCity: new RegExp(`^${origin}$`, 'i'),
      destinationCity: new RegExp(`^${destination}$`, 'i')
    });

    if (routes.length === 0) {
      return res.json({ success: true, count: 0, schedules: [] });
    }

    const routeIds = routes.map((r) => r._id);

    let dateFilter: any = {};
    if (date) {
      const searchDate = new Date(date as string);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      dateFilter = { $gte: startOfDay, $lte: endOfDay };
    } else {
      dateFilter = { $gte: new Date() };
    }

    const schedules = await Schedule.find({
      routeId: { $in: routeIds },
      departureTime: dateFilter,
      status: 'SCHEDULED'
    })
      .populate('busId', 'name busNumber busType totalSeats amenities seatLayout operatorId')
      .populate('routeId', 'originCity destinationCity distanceKm estimatedMinutes stops')
      .sort({ departureTime: 1 });

    res.json({ success: true, count: schedules.length, schedules });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getScheduleDetails = async (req: Request, res: Response) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate({
        path: 'busId',
        populate: { path: 'operatorId', select: 'name operatorName' }
      })
      .populate('routeId');

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    // Fetch Redis temporary locked seats
    const lockedSeats = await getLockedSeats(schedule._id.toString());

    res.json({
      success: true,
      schedule,
      occupiedSeats: {
        bookedSeats: schedule.bookedSeats,
        lockedSeats
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOperatorServices = async (req: AuthRequest, res: Response) => {
  try {
    const operatorId = req.user?._id;

    // Find all buses belonging to this operator
    const operatorBuses = await Bus.find({ operatorId });
    const busIds = operatorBuses.map((b) => b._id);

    // If super admin, allow viewing all schedules or operator-specific
    const query = req.user?.role === 'ADMIN' ? {} : { busId: { $in: busIds } };

    const schedules = await Schedule.find(query)
      .populate('busId', 'name busNumber busType totalSeats amenities')
      .populate('routeId', 'originCity destinationCity distanceKm estimatedMinutes')
      .sort({ departureTime: 1 });

    // Calculate metrics
    let totalRevenue = 0;
    let totalSeatsBooked = 0;
    let totalCapacity = 0;

    const servicesWithStats = schedules.map((s: any) => {
      const bookedCount = s.bookedSeats?.length || 0;
      const capacity = s.busId?.totalSeats || 40;
      const serviceRevenue = bookedCount * (s.baseFare || 0);

      totalRevenue += serviceRevenue;
      totalSeatsBooked += bookedCount;
      totalCapacity += capacity;

      return {
        ...s.toObject(),
        bookedCount,
        capacity,
        occupancyPercent: Math.round((bookedCount / capacity) * 100),
        estimatedRevenue: serviceRevenue
      };
    });

    res.json({
      success: true,
      count: servicesWithStats.length,
      stats: {
        totalServices: servicesWithStats.length,
        totalRevenue,
        totalSeatsBooked,
        overallOccupancy: totalCapacity > 0 ? Math.round((totalSeatsBooked / totalCapacity) * 100) : 0
      },
      services: servicesWithStats
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
