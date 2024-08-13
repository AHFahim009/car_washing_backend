import mongoose, { Schema } from "mongoose";
import { TBooking, VehicleTypes } from "./booking.interface";

const bookingSchema = new Schema<TBooking>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  slot: {
    type: Schema.Types.ObjectId,
    ref: 'Slot',
    required: true,
  },
  vehicleType: {
    type: String,
    enum: Object.values(VehicleTypes),
    required: true,
  },
  vehicleBrand: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  manufacturingYear: {
    type: Number,
    required: true,
  },
  registrationPlate: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const BookingModel = mongoose.model<TBooking>('Booking', bookingSchema);

export default BookingModel;