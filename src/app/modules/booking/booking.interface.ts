import mongoose from "mongoose";

// Define the interface for the booking document

export const VehicleTypes = {
  CAR: 'car',
  TRUCK: 'truck',
  SUV: 'SUV',
  VAN: 'van',
  MOTORCYCLE: 'motorcycle',
  BUS: 'bus',
  ELECTRIC_VEHICLE: 'electricVehicle',
  HYBRID_VEHICLE: 'hybridVehicle',
  BICYCLE: 'bicycle',
  TRACTOR: 'tractor'
} as const;
export type VehicleType = typeof VehicleTypes[keyof typeof VehicleTypes];

export type TBooking = {
  customer: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  slot: mongoose.Types.ObjectId;
  vehicleType: VehicleType;
  vehicleBrand: string;
  vehicleModel: string;
  manufacturingYear: number;
  registrationPlate: string;

}
