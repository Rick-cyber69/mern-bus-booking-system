import { Request, Response } from 'express';
import { Route } from '../models/Route';

export const createRoute = async (req: Request, res: Response) => {
  try {
    const { originCity, destinationCity, distanceKm, estimatedMinutes, stops } = req.body;

    const route = await Route.create({
      originCity: originCity.trim(),
      destinationCity: destinationCity.trim(),
      distanceKm,
      estimatedMinutes,
      stops: stops || []
    });

    res.status(201).json({ success: true, route });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await Route.find().sort({ originCity: 1 });
    res.json({ success: true, count: routes.length, routes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCities = async (req: Request, res: Response) => {
  try {
    const origins = await Route.distinct('originCity');
    const destinations = await Route.distinct('destinationCity');
    const allCities = Array.from(new Set([...origins, ...destinations])).sort();
    res.json({ success: true, cities: allCities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
