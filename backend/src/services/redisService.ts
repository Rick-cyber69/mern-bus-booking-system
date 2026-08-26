import { redisClient, memoryRedis } from '../config/redis';

const SEAT_HOLD_TTL = 600; // 10 minutes in seconds

export const lockSeats = async (
  scheduleId: string,
  seatNumbers: string[],
  userId: string
): Promise<{ success: boolean; lockedSeats: string[]; failedSeats: string[] }> => {
  const lockedSeats: string[] = [];
  const failedSeats: string[] = [];

  for (const seat of seatNumbers) {
    const key = `hold:${scheduleId}:${seat}`;
    try {
      if (redisClient.status === 'ready') {
        const result = await redisClient.set(key, userId, 'EX', SEAT_HOLD_TTL, 'NX');
        if (result === 'OK') {
          lockedSeats.push(seat);
        } else {
          failedSeats.push(seat);
        }
      } else {
        const existing = await memoryRedis.get(key);
        if (!existing) {
          await memoryRedis.setex(key, SEAT_HOLD_TTL, userId);
          lockedSeats.push(seat);
        } else {
          failedSeats.push(seat);
        }
      }
    } catch (error) {
      // Fallback to memory
      const existing = await memoryRedis.get(key);
      if (!existing) {
        await memoryRedis.setex(key, SEAT_HOLD_TTL, userId);
        lockedSeats.push(seat);
      } else {
        failedSeats.push(seat);
      }
    }
  }

  if (failedSeats.length > 0) {
    // Rollback already acquired locks in this attempt
    for (const seat of lockedSeats) {
      await unlockSeats(scheduleId, [seat]);
    }
    return { success: false, lockedSeats: [], failedSeats };
  }

  return { success: true, lockedSeats, failedSeats: [] };
};

export const unlockSeats = async (scheduleId: string, seatNumbers: string[]): Promise<void> => {
  for (const seat of seatNumbers) {
    const key = `hold:${scheduleId}:${seat}`;
    try {
      if (redisClient.status === 'ready') {
        await redisClient.del(key);
      } else {
        await memoryRedis.del(key);
      }
    } catch {
      await memoryRedis.del(key);
    }
  }
};

export const getLockedSeats = async (scheduleId: string): Promise<string[]> => {
  const pattern = `hold:${scheduleId}:*`;
  const lockedSeats: string[] = [];

  try {
    let keys: string[] = [];
    if (redisClient.status === 'ready') {
      keys = await redisClient.keys(pattern);
    } else {
      keys = await memoryRedis.keys(pattern);
    }

    for (const key of keys) {
      const parts = key.split(':');
      if (parts.length === 3) {
        lockedSeats.push(parts[2]);
      }
    }
  } catch (error) {
    const keys = await memoryRedis.keys(pattern);
    for (const key of keys) {
      const parts = key.split(':');
      if (parts.length === 3) {
        lockedSeats.push(parts[2]);
      }
    }
  }

  return lockedSeats;
};
