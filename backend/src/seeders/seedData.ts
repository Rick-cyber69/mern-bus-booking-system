import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User, UserRole } from '../models/User';
import { Bus, BusType, ISeatConfig } from '../models/Bus';
import { Route } from '../models/Route';
import { Schedule } from '../models/Schedule';

dotenv.config();

const generateSeatLayout = (busType: BusType): ISeatConfig[] => {
  const layout: ISeatConfig[] = [];
  if (busType === BusType.AC_SLEEPER || busType === BusType.NON_AC_SLEEPER) {
    // 2x1 Luxury Sleeper Layout (Lower & Upper Deck, 36 berths)
    const decks: ('LOWER' | 'UPPER')[] = ['LOWER', 'UPPER'];
    decks.forEach((deck) => {
      const prefix = deck === 'LOWER' ? 'L' : 'U';
      let seatCount = 1;
      for (let r = 1; r <= 6; r++) {
        // Single window berth
        layout.push({
          seatNumber: `${prefix}${seatCount++}`,
          deck,
          type: 'SLEEPER',
          row: r,
          column: 1,
          isWindow: true
        });
        // Double berth (aisle + window)
        layout.push({
          seatNumber: `${prefix}${seatCount++}`,
          deck,
          type: 'SLEEPER',
          row: r,
          column: 3,
          isWindow: false
        });
        layout.push({
          seatNumber: `${prefix}${seatCount++}`,
          deck,
          type: 'SLEEPER',
          row: r,
          column: 4,
          isWindow: true
        });
      }
    });
  } else {
    // 2x2 Executive Seater Layout (Single Deck, 40 seats)
    let seatNum = 1;
    for (let r = 1; r <= 10; r++) {
      layout.push({ seatNumber: `A${seatNum++}`, deck: 'LOWER', type: 'SEATER', row: r, column: 1, isWindow: true });
      layout.push({ seatNumber: `A${seatNum++}`, deck: 'LOWER', type: 'SEATER', row: r, column: 2, isWindow: false });
      layout.push({ seatNumber: `A${seatNum++}`, deck: 'LOWER', type: 'SEATER', row: r, column: 3, isWindow: false });
      layout.push({ seatNumber: `A${seatNum++}`, deck: 'LOWER', type: 'SEATER', row: r, column: 4, isWindow: true });
    }
  }
  return layout;
};

export const runDatabaseSeed = async () => {
  console.log('[Seed] Starting database seeding process...');

  await User.deleteMany({});
  await Bus.deleteMany({});
  await Route.deleteMany({});
  await Schedule.deleteMany({});

  console.log('[Seed] Cleared existing data');

  // 1. Create Users & Operators
  const admin = await User.create({
    name: 'System Super Admin',
    email: 'admin@busbooking.local',
    password: 'password123',
    phone: '+919876543210',
    role: UserRole.ADMIN
  });

  const operator1 = await User.create({
    name: 'VRL Travel Fleet Admin',
    email: 'operator@expressbus.com',
    password: 'password123',
    phone: '+919876543211',
    role: UserRole.OPERATOR,
    operatorName: 'VRL National Travels'
  });

  const operator2 = await User.create({
    name: 'SRS Travels Operations',
    email: 'operator2@expressbus.com',
    password: 'password123',
    phone: '+919876543212',
    role: UserRole.OPERATOR,
    operatorName: 'SRS Royal Lines'
  });

  const operator3 = await User.create({
    name: 'Orange Tours Hub',
    email: 'operator3@expressbus.com',
    password: 'password123',
    phone: '+919876543214',
    role: UserRole.OPERATOR,
    operatorName: 'Orange Travels'
  });

  const operator4 = await User.create({
    name: 'Zingbus Fleet Admin',
    email: 'operator4@expressbus.com',
    password: 'password123',
    phone: '+919876543215',
    role: UserRole.OPERATOR,
    operatorName: 'Zingbus Electric Smart Lines'
  });

  const passenger = await User.create({
    name: 'Rahul Sharma',
    email: 'alex@gmail.com',
    password: 'password123',
    phone: '+919876543213',
    role: UserRole.PASSENGER
  });

  console.log('[Seed] Created users: Admin, 4 Fleet Operators, Passenger');

  // 2. Create Fleet Buses
  const sleeperLayout = generateSeatLayout(BusType.AC_SLEEPER);
  const seaterLayout = generateSeatLayout(BusType.AC_SEATER);

  const busList = await Bus.create([
    {
      operatorId: operator1._id,
      busNumber: 'KA-01-AK-9901',
      name: 'VRL Volvo 9600 Multi-Axle AC Sleeper (2+1)',
      busType: BusType.AC_SLEEPER,
      totalSeats: sleeperLayout.length,
      amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle', 'Reading Light', 'Emergency SOS'],
      seatLayout: sleeperLayout
    },
    {
      operatorId: operator1._id,
      busNumber: 'KA-04-F-5502',
      name: 'VRL BharatBenz Executive AC Seater (2+2)',
      busType: BusType.AC_SEATER,
      totalSeats: seaterLayout.length,
      amenities: ['WiFi', 'Charging Point', 'Reclining Seats', 'Water Bottle'],
      seatLayout: seaterLayout
    },
    {
      operatorId: operator2._id,
      busNumber: 'MH-02-TR-1011',
      name: 'SRS Royal Scania Multi-Axle Sleeper',
      busType: BusType.AC_SLEEPER,
      totalSeats: sleeperLayout.length,
      amenities: ['WiFi', 'Live Tracking', 'Charging Point', 'Blanket', 'Snacks'],
      seatLayout: sleeperLayout
    },
    {
      operatorId: operator2._id,
      busNumber: 'DL-01-EX-2022',
      name: 'SRS InterCity Luxury Coach (2+2)',
      busType: BusType.AC_SEATER,
      totalSeats: seaterLayout.length,
      amenities: ['Charging Point', 'Comfort Recliners', 'Reading Light'],
      seatLayout: seaterLayout
    },
    {
      operatorId: operator3._id,
      busNumber: 'AP-09-OR-3033',
      name: 'Orange Mercedes-Benz Multi-Axle Sleeper (2+1)',
      busType: BusType.AC_SLEEPER,
      totalSeats: sleeperLayout.length,
      amenities: ['WiFi', 'Personal LCD Screen', 'Charging Point', 'Pillow', 'Water Bottle'],
      seatLayout: sleeperLayout
    },
    {
      operatorId: operator3._id,
      busNumber: 'TS-08-OR-4044',
      name: 'Orange Super Luxury AC Coach (2+2)',
      busType: BusType.AC_SEATER,
      totalSeats: seaterLayout.length,
      amenities: ['Charging Point', 'Reclining Pushback Seats', 'Water Bottle'],
      seatLayout: seaterLayout
    },
    {
      operatorId: operator4._id,
      busNumber: 'DL-04-ZG-5055',
      name: 'Zingbus Smart EV Electric Sleeper (2+1)',
      busType: BusType.AC_SLEEPER,
      totalSeats: sleeperLayout.length,
      amenities: ['Zero Emission EV', 'WiFi', 'Charging Point', 'Air Purifier', 'Blanket'],
      seatLayout: sleeperLayout
    },
    {
      operatorId: operator4._id,
      busNumber: 'HR-26-ZG-6066',
      name: 'Zingbus Premium AC Express Seater (2+2)',
      busType: BusType.AC_SEATER,
      totalSeats: seaterLayout.length,
      amenities: ['Live GPS Tracking', 'Type-C Fast Charging', 'Emergency SOS'],
      seatLayout: seaterLayout
    }
  ]);

  console.log('[Seed] Created 8 fleet buses across 4 operators');

  // 3. Comprehensive Indian Intercity Routes (45+ Major Routes)
  const routeDefinitions = [
    // === South India Major Hubs ===
    { originCity: 'Bangalore', destinationCity: 'Hyderabad', distanceKm: 570, estimatedMinutes: 480, stops: [{ city: 'Anantapur', pickupPoint: 'Clock Tower Hub', arrivalOffsetMinutes: 180 }, { city: 'Kurnool', pickupPoint: 'Highway Toll Station', arrivalOffsetMinutes: 320 }] },
    { originCity: 'Hyderabad', destinationCity: 'Bangalore', distanceKm: 570, estimatedMinutes: 480, stops: [{ city: 'Kurnool', pickupPoint: 'Highway Toll Station', arrivalOffsetMinutes: 160 }, { city: 'Anantapur', pickupPoint: 'Clock Tower Hub', arrivalOffsetMinutes: 300 }] },
    { originCity: 'Bangalore', destinationCity: 'Chennai', distanceKm: 345, estimatedMinutes: 360, stops: [{ city: 'Hosur', pickupPoint: 'Central Bus Stand', arrivalOffsetMinutes: 60 }, { city: 'Vellore', pickupPoint: 'Bypass Hub', arrivalOffsetMinutes: 200 }] },
    { originCity: 'Chennai', destinationCity: 'Bangalore', distanceKm: 345, estimatedMinutes: 360, stops: [{ city: 'Vellore', pickupPoint: 'Bypass Hub', arrivalOffsetMinutes: 160 }, { city: 'Hosur', pickupPoint: 'Central Bus Stand', arrivalOffsetMinutes: 300 }] },
    { originCity: 'Bangalore', destinationCity: 'Goa', distanceKm: 560, estimatedMinutes: 600, stops: [{ city: 'Tumkur', pickupPoint: 'Bypass Hub', arrivalOffsetMinutes: 80 }, { city: 'Hubli', pickupPoint: 'Old Bus Stand', arrivalOffsetMinutes: 360 }] },
    { originCity: 'Goa', destinationCity: 'Bangalore', distanceKm: 560, estimatedMinutes: 600, stops: [{ city: 'Hubli', pickupPoint: 'Old Bus Stand', arrivalOffsetMinutes: 240 }, { city: 'Tumkur', pickupPoint: 'Bypass Hub', arrivalOffsetMinutes: 520 }] },
    { originCity: 'Bangalore', destinationCity: 'Kochi', distanceKm: 540, estimatedMinutes: 540, stops: [{ city: 'Salem', pickupPoint: 'New Bus Stand', arrivalOffsetMinutes: 200 }, { city: 'Coimbatore', pickupPoint: 'Gandhipuram', arrivalOffsetMinutes: 330 }] },
    { originCity: 'Kochi', destinationCity: 'Bangalore', distanceKm: 540, estimatedMinutes: 540, stops: [{ city: 'Coimbatore', pickupPoint: 'Gandhipuram', arrivalOffsetMinutes: 210 }, { city: 'Salem', pickupPoint: 'New Bus Stand', arrivalOffsetMinutes: 340 }] },
    { originCity: 'Bangalore', destinationCity: 'Mysore', distanceKm: 145, estimatedMinutes: 180, stops: [{ city: 'Mandya', pickupPoint: 'Highway Junction', arrivalOffsetMinutes: 90 }] },
    { originCity: 'Mysore', destinationCity: 'Bangalore', distanceKm: 145, estimatedMinutes: 180, stops: [{ city: 'Mandya', pickupPoint: 'Highway Junction', arrivalOffsetMinutes: 90 }] },
    { originCity: 'Bangalore', destinationCity: 'Mangalore', distanceKm: 350, estimatedMinutes: 420, stops: [{ city: 'Hassan', pickupPoint: 'Bus Terminal', arrivalOffsetMinutes: 180 }, { city: 'Sakleshpur', pickupPoint: 'Ghat Junction', arrivalOffsetMinutes: 260 }] },
    { originCity: 'Chennai', destinationCity: 'Coimbatore', distanceKm: 505, estimatedMinutes: 480, stops: [{ city: 'Salem', pickupPoint: 'AVR Roundana', arrivalOffsetMinutes: 300 }] },
    { originCity: 'Coimbatore', destinationCity: 'Chennai', distanceKm: 505, estimatedMinutes: 480, stops: [{ city: 'Salem', pickupPoint: 'AVR Roundana', arrivalOffsetMinutes: 180 }] },
    { originCity: 'Chennai', destinationCity: 'Madurai', distanceKm: 460, estimatedMinutes: 450, stops: [{ city: 'Trichy', pickupPoint: 'Central Bus Stand', arrivalOffsetMinutes: 270 }] },
    { originCity: 'Chennai', destinationCity: 'Pondicherry', distanceKm: 150, estimatedMinutes: 180, stops: [{ city: 'Mahabalipuram', pickupPoint: 'ECR Junction', arrivalOffsetMinutes: 60 }] },
    { originCity: 'Hyderabad', destinationCity: 'Vijayawada', distanceKm: 275, estimatedMinutes: 300, stops: [{ city: 'Suryapet', pickupPoint: 'Highway Motel', arrivalOffsetMinutes: 130 }] },
    { originCity: 'Vijayawada', destinationCity: 'Visakhapatnam', distanceKm: 350, estimatedMinutes: 360, stops: [{ city: 'Rajahmundry', pickupPoint: 'Kotipalli Bus Stand', arrivalOffsetMinutes: 180 }] },
    { originCity: 'Bangalore', destinationCity: 'Tirupati', distanceKm: 250, estimatedMinutes: 270, stops: [{ city: 'Kolar', pickupPoint: 'By-pass', arrivalOffsetMinutes: 70 }, { city: 'Chittoor', pickupPoint: 'Old Bus Stand', arrivalOffsetMinutes: 160 }] },
    { originCity: 'Kochi', destinationCity: 'Trivandrum', distanceKm: 200, estimatedMinutes: 270, stops: [{ city: 'Alappuzha', pickupPoint: 'Boat Jetty', arrivalOffsetMinutes: 80 }, { city: 'Kollam', pickupPoint: 'Chinnakada', arrivalOffsetMinutes: 170 }] },

    // === West & Central India Corridors ===
    { originCity: 'Mumbai', destinationCity: 'Pune', distanceKm: 150, estimatedMinutes: 180, stops: [{ city: 'Navi Mumbai', pickupPoint: 'Vashi Plaza', arrivalOffsetMinutes: 45 }, { city: 'Lonavala', pickupPoint: 'Expressway Stop', arrivalOffsetMinutes: 100 }] },
    { originCity: 'Pune', destinationCity: 'Mumbai', distanceKm: 150, estimatedMinutes: 180, stops: [{ city: 'Lonavala', pickupPoint: 'Expressway Stop', arrivalOffsetMinutes: 80 }, { city: 'Navi Mumbai', pickupPoint: 'Vashi Plaza', arrivalOffsetMinutes: 135 }] },
    { originCity: 'Mumbai', destinationCity: 'Goa', distanceKm: 590, estimatedMinutes: 660, stops: [{ city: 'Satara', pickupPoint: 'Highway Point', arrivalOffsetMinutes: 260 }, { city: 'Kolhapur', pickupPoint: 'Central Bus Stand', arrivalOffsetMinutes: 400 }] },
    { originCity: 'Goa', destinationCity: 'Mumbai', distanceKm: 590, estimatedMinutes: 660, stops: [{ city: 'Kolhapur', pickupPoint: 'Central Bus Stand', arrivalOffsetMinutes: 260 }, { city: 'Satara', pickupPoint: 'Highway Point', arrivalOffsetMinutes: 400 }] },
    { originCity: 'Pune', destinationCity: 'Goa', distanceKm: 440, estimatedMinutes: 510, stops: [{ city: 'Kolhapur', pickupPoint: 'Central Bus Stand', arrivalOffsetMinutes: 240 }] },
    { originCity: 'Mumbai', destinationCity: 'Ahmedabad', distanceKm: 525, estimatedMinutes: 540, stops: [{ city: 'Surat', pickupPoint: 'Kadodara Char Rasta', arrivalOffsetMinutes: 300 }, { city: 'Vadodara', pickupPoint: 'Amit Nagar Circle', arrivalOffsetMinutes: 420 }] },
    { originCity: 'Ahmedabad', destinationCity: 'Mumbai', distanceKm: 525, estimatedMinutes: 540, stops: [{ city: 'Vadodara', pickupPoint: 'Amit Nagar Circle', arrivalOffsetMinutes: 120 }, { city: 'Surat', pickupPoint: 'Kadodara Char Rasta', arrivalOffsetMinutes: 240 }] },
    { originCity: 'Pune', destinationCity: 'Shirdi', distanceKm: 200, estimatedMinutes: 270, stops: [{ city: 'Ahmednagar', pickupPoint: 'Kotla Stand', arrivalOffsetMinutes: 150 }] },
    { originCity: 'Mumbai', destinationCity: 'Nashik', distanceKm: 170, estimatedMinutes: 210, stops: [{ city: 'Thane', pickupPoint: 'Teen Hath Naka', arrivalOffsetMinutes: 40 }, { city: 'Igatpuri', pickupPoint: 'Highway Hub', arrivalOffsetMinutes: 120 }] },
    { originCity: 'Ahmedabad', destinationCity: 'Surat', distanceKm: 260, estimatedMinutes: 270, stops: [{ city: 'Vadodara', pickupPoint: 'Golden Chokdi', arrivalOffsetMinutes: 110 }, { city: 'Bharuch', pickupPoint: 'Narmada Bridge', arrivalOffsetMinutes: 180 }] },
    { originCity: 'Mumbai', destinationCity: 'Nagpur', distanceKm: 830, estimatedMinutes: 780, stops: [{ city: 'Nashik', pickupPoint: 'Dwarka Circle', arrivalOffsetMinutes: 200 }, { city: 'Aurangabad', pickupPoint: 'CIDCO Bus Stand', arrivalOffsetMinutes: 400 }] },
    { originCity: 'Indore', destinationCity: 'Bhopal', distanceKm: 195, estimatedMinutes: 210, stops: [{ city: 'Dewas', pickupPoint: 'Bypass Junction', arrivalOffsetMinutes: 45 }, { city: 'Sehore', pickupPoint: 'Crescent Water Park', arrivalOffsetMinutes: 140 }] },
    { originCity: 'Ahmedabad', destinationCity: 'Udaipur', distanceKm: 260, estimatedMinutes: 300, stops: [{ city: 'Himmatnagar', pickupPoint: 'Motipura Circle', arrivalOffsetMinutes: 80 }, { city: 'Shamlaji', pickupPoint: 'Highway Hub', arrivalOffsetMinutes: 140 }] },

    // === North India Corridors ===
    { originCity: 'Delhi', destinationCity: 'Jaipur', distanceKm: 270, estimatedMinutes: 300, stops: [{ city: 'Gurugram', pickupPoint: 'IFFCO Chowk', arrivalOffsetMinutes: 45 }, { city: 'Kotputli', pickupPoint: 'Highway Motel', arrivalOffsetMinutes: 160 }] },
    { originCity: 'Jaipur', destinationCity: 'Delhi', distanceKm: 270, estimatedMinutes: 300, stops: [{ city: 'Kotputli', pickupPoint: 'Highway Motel', arrivalOffsetMinutes: 140 }, { city: 'Gurugram', pickupPoint: 'IFFCO Chowk', arrivalOffsetMinutes: 255 }] },
    { originCity: 'Delhi', destinationCity: 'Chandigarh', distanceKm: 245, estimatedMinutes: 270, stops: [{ city: 'Panipat', pickupPoint: 'Toll Plaza', arrivalOffsetMinutes: 90 }, { city: 'Ambala', pickupPoint: 'Cantt Bus Stand', arrivalOffsetMinutes: 190 }] },
    { originCity: 'Chandigarh', destinationCity: 'Delhi', distanceKm: 245, estimatedMinutes: 270, stops: [{ city: 'Ambala', pickupPoint: 'Cantt Bus Stand', arrivalOffsetMinutes: 80 }, { city: 'Panipat', pickupPoint: 'Toll Plaza', arrivalOffsetMinutes: 180 }] },
    { originCity: 'Delhi', destinationCity: 'Agra', distanceKm: 230, estimatedMinutes: 210, stops: [{ city: 'Noida', pickupPoint: 'Mahamaya Flyover', arrivalOffsetMinutes: 35 }, { city: 'Mathura', pickupPoint: 'Expressway Cut', arrivalOffsetMinutes: 140 }] },
    { originCity: 'Delhi', destinationCity: 'Dehradun', distanceKm: 260, estimatedMinutes: 330, stops: [{ city: 'Meerut', pickupPoint: 'Modipuram Bypass', arrivalOffsetMinutes: 70 }, { city: 'Roorkee', pickupPoint: 'IIT Gate', arrivalOffsetMinutes: 210 }] },
    { originCity: 'Delhi', destinationCity: 'Rishikesh', distanceKm: 240, estimatedMinutes: 330, stops: [{ city: 'Haridwar', pickupPoint: 'Har Ki Pauri Cut', arrivalOffsetMinutes: 270 }] },
    { originCity: 'Delhi', destinationCity: 'Shimla', distanceKm: 345, estimatedMinutes: 480, stops: [{ city: 'Chandigarh', pickupPoint: 'Tribune Chowk', arrivalOffsetMinutes: 260 }, { city: 'Solan', pickupPoint: 'Bypass Hub', arrivalOffsetMinutes: 400 }] },
    { originCity: 'Delhi', destinationCity: 'Manali', distanceKm: 530, estimatedMinutes: 720, stops: [{ city: 'Chandigarh', pickupPoint: 'ISBT 43', arrivalOffsetMinutes: 260 }, { city: 'Kullu', pickupPoint: 'Bhuntar Airport Hub', arrivalOffsetMinutes: 640 }] },
    { originCity: 'Delhi', destinationCity: 'Lucknow', distanceKm: 550, estimatedMinutes: 480, stops: [{ city: 'Agra', pickupPoint: 'Inner Ring Road', arrivalOffsetMinutes: 180 }, { city: 'Kanpur', pickupPoint: 'Rama Devi Chauraha', arrivalOffsetMinutes: 380 }] },
    { originCity: 'Lucknow', destinationCity: 'Varanasi', distanceKm: 310, estimatedMinutes: 360, stops: [{ city: 'Rae Bareli', pickupPoint: 'Civil Lines', arrivalOffsetMinutes: 90 }, { city: 'Prayagraj', pickupPoint: 'Civil Lines Bus Station', arrivalOffsetMinutes: 220 }] },
    { originCity: 'Jaipur', destinationCity: 'Udaipur', distanceKm: 395, estimatedMinutes: 420, stops: [{ city: 'Ajmer', pickupPoint: 'Gaggal Toll', arrivalOffsetMinutes: 130 }, { city: 'Bhilwara', pickupPoint: 'Circuit House', arrivalOffsetMinutes: 260 }] },
    { originCity: 'Jaipur', destinationCity: 'Jodhpur', distanceKm: 335, estimatedMinutes: 360, stops: [{ city: 'Ajmer', pickupPoint: 'Parbatpura Bypass', arrivalOffsetMinutes: 130 }, { city: 'Beawar', pickupPoint: 'Chang Gate', arrivalOffsetMinutes: 200 }] },
    { originCity: 'Chandigarh', destinationCity: 'Amritsar', distanceKm: 230, estimatedMinutes: 270, stops: [{ city: 'Ludhiana', pickupPoint: 'Sherpur Chowk', arrivalOffsetMinutes: 110 }, { city: 'Jalandhar', pickupPoint: 'Rama Mandi', arrivalOffsetMinutes: 180 }] },

    // === East & Central India Corridors ===
    { originCity: 'Kolkata', destinationCity: 'Siliguri', distanceKm: 570, estimatedMinutes: 720, stops: [{ city: 'Malda', pickupPoint: 'Rathbari More', arrivalOffsetMinutes: 380 }, { city: 'Raiganj', pickupPoint: 'Siliguri More', arrivalOffsetMinutes: 500 }] },
    { originCity: 'Kolkata', destinationCity: 'Bhubaneswar', distanceKm: 440, estimatedMinutes: 480, stops: [{ city: 'Kharagpur', pickupPoint: 'Chowringhee More', arrivalOffsetMinutes: 130 }, { city: 'Balasore', pickupPoint: 'Station Hub', arrivalOffsetMinutes: 260 }] },
    { originCity: 'Patna', destinationCity: 'Ranchi', distanceKm: 330, estimatedMinutes: 420, stops: [{ city: 'Gaya', pickupPoint: 'Gandhi Maidan', arrivalOffsetMinutes: 120 }, { city: 'Hazaribagh', pickupPoint: 'Indrapuri Chowk', arrivalOffsetMinutes: 270 }] }
  ];

  const createdRoutes = await Route.create(routeDefinitions);
  console.log(`[Seed] Created ${createdRoutes.length} Indian intercity routes`);

  // 4. Create Multi-Slot Schedules (Morning, Afternoon, Evening, Night) across 5 Calendar Days
  const schedulesToCreate: any[] = [];
  const baseFaresINR: { [key: string]: number } = {
    'Bangalore': 850,
    'Hyderabad': 950,
    'Chennai': 750,
    'Mumbai': 650,
    'Pune': 550,
    'Goa': 1200,
    'Kochi': 1100,
    'Coimbatore': 700,
    'Ahmedabad': 850,
    'Surat': 500,
    'Delhi': 600,
    'Jaipur': 550,
    'Chandigarh': 450,
    'Agra': 400,
    'Lucknow': 800,
    'Varanasi': 650,
    'Dehradun': 600,
    'Rishikesh': 550,
    'Shimla': 750,
    'Manali': 1450,
    'Udaipur': 650,
    'Jodhpur': 600,
    'Amritsar': 550,
    'Indore': 450,
    'Nagpur': 950,
    'Mysore': 350,
    'Mangalore': 650,
    'Madurai': 600,
    'Pondicherry': 350,
    'Vijayawada': 500,
    'Visakhapatnam': 700,
    'Tirupati': 450,
    'Trivandrum': 500,
    'Kolkata': 950,
    'Patna': 650
  };

  // Departure slots: Morning (07:30), Afternoon (14:00), Evening (19:30), Night Sleeper (21:45)
  const departureSlots = [
    { hour: 7, minute: 30, isSleeperPreferred: false, priceMultiplier: 1.0 },
    { hour: 14, minute: 0, isSleeperPreferred: false, priceMultiplier: 0.95 },
    { hour: 19, minute: 30, isSleeperPreferred: true, priceMultiplier: 1.15 },
    { hour: 21, minute: 45, isSleeperPreferred: true, priceMultiplier: 1.25 }
  ];

  for (let dayOffset = 0; dayOffset <= 4; dayOffset++) {
    for (let i = 0; i < createdRoutes.length; i++) {
      const route = createdRoutes[i];
      const baseRate = baseFaresINR[route.originCity] || 700;

      // Schedule 2 distinct departures per route per day
      const slotsForRoute = [
        departureSlots[(i + dayOffset) % departureSlots.length],
        departureSlots[(i + dayOffset + 2) % departureSlots.length]
      ];

      slotsForRoute.forEach((slot, slotIdx) => {
        // Choose appropriate bus type
        const busCandidates = slot.isSleeperPreferred
          ? busList.filter(b => b.busType === BusType.AC_SLEEPER)
          : busList.filter(b => b.busType === BusType.AC_SEATER);

        const chosenBus = (busCandidates.length > 0)
          ? busCandidates[(i + slotIdx) % busCandidates.length]
          : busList[(i + slotIdx) % busList.length];

        const depTime = new Date();
        depTime.setDate(depTime.getDate() + dayOffset);
        depTime.setHours(slot.hour, slot.minute, 0, 0);

        const arrTime = new Date(depTime);
        arrTime.setMinutes(arrTime.getMinutes() + route.estimatedMinutes);

        const finalFare = Math.round(baseRate * slot.priceMultiplier + (chosenBus.busType === BusType.AC_SLEEPER ? 250 : 0));

        schedulesToCreate.push({
          busId: chosenBus._id,
          routeId: route._id,
          departureTime: depTime,
          arrivalTime: arrTime,
          baseFare: finalFare,
          status: 'SCHEDULED',
          bookedSeats: []
        });
      });
    }
  }

  await Schedule.create(schedulesToCreate);
  console.log(`[Seed] Created ${schedulesToCreate.length} departure schedules across 5 calendar days!`);

  return {
    success: true,
    routesCount: createdRoutes.length,
    busesCount: busList.length,
    schedulesCount: schedulesToCreate.length
  };
};

// CLI execution wrapper
if (require.main === module) {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bus_booking_db';
  mongoose.connect(mongoUri)
    .then(() => runDatabaseSeed())
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
