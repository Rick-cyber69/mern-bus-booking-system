import mongoose, { Document, Schema } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface IPassenger {
  seatNumber: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface IBooking extends Document {
  pnr: string;
  userId: mongoose.Types.ObjectId;
  scheduleId: mongoose.Types.ObjectId;
  passengers: IPassenger[];
  seatNumbers: string[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  qrCodeData: string;
  pdfTicketPath?: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    pnr: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
    passengers: [
      {
        seatNumber: { type: String, required: true },
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true }
      }
    ],
    seatNumbers: [{ type: String, required: true }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    bookingStatus: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.CONFIRMED },
    qrCodeData: { type: String },
    pdfTicketPath: { type: String }
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
