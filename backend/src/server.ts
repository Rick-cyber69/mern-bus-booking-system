import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { redisClient } from './config/redis';
import { initSocket } from './services/socketService';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect MongoDB
  await connectDB();

  // Connect Redis
  try {
    await redisClient.connect();
  } catch {
    console.log('[Redis] Running in local in-memory fallback mode.');
  }

  // Create HTTP Server & Bind WebSockets
  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Bus Booking Backend Server running on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
};

startServer();
