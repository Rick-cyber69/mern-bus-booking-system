import { Response } from 'express';
import { Bus, BusType } from '../models/Bus';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

export const createBus = async (req: AuthRequest, res: Response) => {
  try {
    const { busNumber, name, busType, totalSeats, amenities, seatLayout } = req.body;

    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(400).json({ success: false, message: 'Bus with this registration number already exists' });
    }

    const bus = await Bus.create({
      operatorId: req.user?._id,
      busNumber,
      name,
      busType,
      totalSeats,
      amenities: amenities || ['WiFi', 'Charging Point'],
      seatLayout: seatLayout || []
    });

    res.status(201).json({ success: true, bus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBuses = async (req: AuthRequest, res: Response) => {
  try {
    let query: any = {};
    if (req.user?.role === UserRole.OPERATOR) {
      query.operatorId = req.user._id;
    }

    const buses = await Bus.find(query).populate('operatorId', 'name operatorName email');
    res.json({ success: true, count: buses.length, buses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBusById = async (req: AuthRequest, res: Response) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('operatorId', 'name operatorName');
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }
    res.json({ success: true, bus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
