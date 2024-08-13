import { z } from "zod";
import { VehicleTypes } from "./booking.interface";

export const BookingSchema = z.object({
  serviceId: z.string({ message: "Service ID is required." }),
  slotId: z.string({ message: "Slot ID is required." }),
  vehicleType: z.enum(Object.values(VehicleTypes) as [string, ...string[]]),
  vehicleBrand: z.string({ message: "Vehicle Brand is required" }),
  vehicleModel: z.string({ message: "Vehicle Model is required" }),
  manufacturingYear: z
    .number()
    .min(1900, "Manufacturing Year must be at least 1900.")
    .max(
      new Date().getFullYear(),
      "Manufacturing Year cannot be in the future."
    ),
  registrationPlate: z.string({ message: "Registration Plate is required." })
});


export const BookingValidation = {
  BookingSchema
}