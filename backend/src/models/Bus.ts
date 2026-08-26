import mongoose, { Document, Schema } from 'mongoose';

export enum BusType {
  AC_SLEEPER = 'AC_SLEEPER',
  NON_AC_SLEEPER = 'NON_AC_SLEEPER',
  AC_SEATER = 'AC_SEATER',
  NON_AC_SEATER = 'NON_AC_SEATER',
  VOLVO_MULTI_AXLE = 'VOLVO_MULTI_AXLE'
}

export interface ISeatConfig {
  seatNumber: string; // e.g. "L1", "U5", "A2"
  deck: 'LOWER' | 'UPPER';
  type: 'SEATER' | 'SLEEPER';
  row: number;
  column: number;
  isWindow?: boolean;
}

export interface IBus extends Document {
  operatorId: mongoose.Types.ObjectId;
  busNumber: string;
  name: string;
  busType: BusType;
  totalSeats: number;
  amenities: string[];
  seatLayout: ISeatConfig[];
}

const busSchema = new Schema<IBus>(
  {
    operatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    busNumber: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    busType: { type: String, enum: Object.values(BusType), required: true },
    totalSeats: { type: Number, required: true },
    amenities: [{ type: String }],
    seatLayout: [
      {
        seatNumber: { type: String, required: true },
        deck: { type: String, enum: ['LOWER', 'UPPER'], default: 'LOWER' },
        type: { type: String, enum: ['SEATER', 'SLEEPER'], default: 'SEATER' },
        row: { type: Number, required: true },
        column: { type: Number, required: true },
        isWindow: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

export const Bus = mongoose.model<IBus>('Bus', busSchema);
