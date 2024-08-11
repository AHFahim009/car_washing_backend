import mongoose, { Schema } from 'mongoose';
import { TOurService } from './ourService.interface';

// Define the Mongoose schema
const serviceSchema = new Schema<TOurService>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define the Mongoose model
const ServiceModel = mongoose.model<TOurService>('Service', serviceSchema);

export default ServiceModel;
