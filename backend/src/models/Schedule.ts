import mongoose, { Document, Schema } from 'mongoose';

export enum ScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ISchedule extends Document {
  busId: mongoose.Types.ObjectId;
  routeId: mongoose.Types.ObjectId;
  departureTime: Date;
  arrivalTime: Date;
  baseFare: number;
  status: ScheduleStatus;
  seatPrices?: Map<string, number>;
  bookedSeats: string[]; // List of permanently booked seat numbers
}

const scheduleSchema = new Schema<ISchedule>(
  {
    busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
    routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    baseFare: { type: Number, required: true },
    status: { type: String, enum: Object.values(ScheduleStatus), default: ScheduleStatus.SCHEDULED },
    seatPrices: { type: Map, of: Number },
    bookedSeats: [{ type: String }]
  },
  { timestamps: true }
);

scheduleSchema.index({ departureTime: 1, routeId: 1 });

export const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);
