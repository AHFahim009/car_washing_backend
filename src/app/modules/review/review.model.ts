import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Review
interface IReview extends Document {
  feedback: string;
  rating: number;
}

// Define the Review schema
const reviewSchema: Schema = new Schema(
  {
    feedback: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // Assuming rating is from 1 to 5
  },
  {
    timestamps: true,
  }
);

// Create and export the Mongoose model
const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
