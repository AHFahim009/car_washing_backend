import mongoose, { Schema } from 'mongoose';
import { TSlot } from './slot.interface';



// Define the Slot schema
export const SlotSchema = new Schema<TSlot>(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBooked: {
      type: String,
      enum: ['available', 'booked', 'canceled'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Export the Slot model
export const SlotModel = mongoose.model<TSlot>('Slot', SlotSchema);
