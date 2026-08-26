import mongoose, { Document, Schema } from 'mongoose';

export interface IRouteStop {
  city: string;
  pickupPoint: string;
  arrivalOffsetMinutes: number;
}

export interface IRoute extends Document {
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedMinutes: number;
  stops: IRouteStop[];
}

const routeSchema = new Schema<IRoute>(
  {
    originCity: { type: String, required: true, trim: true },
    destinationCity: { type: String, required: true, trim: true },
    distanceKm: { type: Number, required: true },
    estimatedMinutes: { type: Number, required: true },
    stops: [
      {
        city: { type: String, required: true },
        pickupPoint: { type: String, required: true },
        arrivalOffsetMinutes: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

routeSchema.index({ originCity: 1, destinationCity: 1 });

export const Route = mongoose.model<IRoute>('Route', routeSchema);
