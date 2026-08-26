export type UserRole = 'PASSENGER' | 'OPERATOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  operatorName?: string;
}

export interface SeatConfig {
  seatNumber: string;
  deck: 'LOWER' | 'UPPER';
  type: 'SEATER' | 'SLEEPER';
  row: number;
  column: number;
  isWindow?: boolean;
}

export interface Bus {
  _id: string;
  busNumber: string;
  name: string;
  busType: string;
  totalSeats: number;
  amenities: string[];
  seatLayout: SeatConfig[];
  operatorId?: any;
}

export interface RouteStop {
  city: string;
  pickupPoint: string;
  arrivalOffsetMinutes: number;
}

export interface Route {
  _id: string;
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedMinutes: number;
  stops: RouteStop[];
}

export interface Schedule {
  _id: string;
  busId: Bus;
  routeId: Route;
  departureTime: string;
  arrivalTime: string;
  baseFare: number;
  status: string;
  bookedSeats: string[];
}

export interface PassengerInfo {
  seatNumber: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface Booking {
  _id: string;
  pnr: string;
  scheduleId: Schedule;
  passengers: PassengerInfo[];
  seatNumbers: string[];
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  qrCodeData: string;
  createdAt: string;
}
