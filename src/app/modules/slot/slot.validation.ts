import { z } from 'zod';
import mongoose from 'mongoose';

const SlotSchema = z.object({
  service: z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: 'Invalid service ID',
    }),
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: 'Invalid date format',
  }),
  startTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Use HH:mm format.',
  }),
  endTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Use HH:mm format.',
  }),
  isBooked: z.enum(['available', 'booked', 'canceled']).optional(),
});

export const slotValidation = {
  SlotSchema
}