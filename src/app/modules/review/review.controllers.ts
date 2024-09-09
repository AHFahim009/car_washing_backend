import { Request, Response } from "express";
import Review from "./review.model";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

// Create a new review
export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { feedback, rating } = req.body;

    const newReview = new Review({ feedback, rating });
    const savedReview = await newReview.save();

    sendResponse(res, {
      statusCode: 200,
      message: "review submit successfully",
      success: true,
      data: savedReview,
    });
  }
);
// Get all reviews
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find();

  sendResponse(res, {
    statusCode: 200,
    message: "retrieve all reviews successfully",
    success: true,
    data: reviews,
  });
});



export const ReviewControllers = {
  createReview,
  getReviews
}
