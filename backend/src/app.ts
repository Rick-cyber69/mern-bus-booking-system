import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import busRoutes from './routes/busRoutes';
import routeRoutes from './routes/routeRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import bookingRoutes from './routes/bookingRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import { runDatabaseSeed } from './seeders/seedData';

dotenv.config();

const app = express();

// Enable Dynamic CORS (Allows local dev + any production Render URL)
app.use(cors({
  origin: true, // Echoes the request origin to allow credentials
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'Bus Booking System API is healthy', timestamp: new Date() });
});

// One-click Database Initializer / Seed Endpoint
app.get('/api/seed', async (req, res) => {
  try {
    const result = await runDatabaseSeed();
    res.json({
      success: true,
      message: 'MongoDB Atlas Cloud Database seeded successfully with 41 cities, 49 routes, 8 buses, 490 schedules, and demo users!',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Middleware
app.use(errorHandler);

export default app;
