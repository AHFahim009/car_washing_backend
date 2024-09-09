import { z } from 'zod';

// Define the Zod validation schema
export const serviceSchema = z.object({
  name: z.string({ message: 'Service name is required' }), // Title of the service
  description: z.string({ message: "Service description is required" }),
  price: z.coerce.number().min(0, 'Price must be a positive number'), // Cost of the service
  duration: z.coerce.number().int().positive('Duration must be a positive integer'), // Duration of the service
  isDeleted: z.boolean().default(false), // Indicates whether the service is marked as deleted
});
export const serviceUpdateSchema = z.object({
  name: z.string({ message: 'Service name is required' }).optional(), // Title of the service
  description: z.string({ message: "Service description is required" }).optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number').optional(), // Cost of the service
  duration: z.coerce.number().int().positive('Duration must be a positive integer').optional(), // Duration of the service
  isDeleted: z.boolean().default(false).optional(), // Indicates whether the service is marked as deleted
});

export const OurServiceValidation = {
  serviceSchema, serviceUpdateSchema
}