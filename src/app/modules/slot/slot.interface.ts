import { Types } from 'mongoose';

export type TSlot = {
  service: Types.ObjectId; // Reference to the Service model
  date: string;
  startTime: string; // Consider storing time as a string in HH:mm format
  endTime: string; // Same as startTime
  isBooked: 'available' | 'booked' | 'canceled';
}