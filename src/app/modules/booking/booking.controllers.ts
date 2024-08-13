/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../../error/AppError";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { SlotModel } from "../slot/slot.model";
import BookingModel from "./booking.model";

export const createBooking = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError(404, "you have no permission");

  const {
    serviceId,
    slotId,
    vehicleType,
    vehicleBrand,
    vehicleModel,
    manufacturingYear,
    registrationPlate,
  } = req.body;

  // Check if the slot exists and is available
  const slot = await SlotModel.findById(slotId).populate("service");

  if (!slot) {
    throw new AppError(404, "Slot not found.");
  }

  if (slot.isBooked !== "available") {
    throw new AppError(400, "Slot is not available for booking.");
  }

  // Check if the service exists
  const service = slot.service as any;

  if (service._id.toString() !== serviceId || service.isDeleted) {
    throw new AppError(404, "Service not found or is deleted.");
  }

  // Create the booking
  const booking = await BookingModel.create({
    customer: userId,
    service: serviceId,
    slot: slotId,
    vehicleType,
    vehicleBrand,
    vehicleModel,
    manufacturingYear,
    registrationPlate,
  });

  // Update the slot to 'booked'
  slot.isBooked = "booked";
  await slot.save();

  // Prepare the response data
  const responseBooking = await BookingModel.findById(booking._id)
    .populate({
      path: "customer",
      select: "_id name email phone address",
    })
    .populate({
      path: "service",
      select: "_id name description price duration isDeleted",
    })
    .populate({
      path: "slot",
      select: "_id service date startTime endTime isBooked",
    })
    .exec();

  // Send the response
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking successful",
    data: responseBooking,
  });
});


export const getAllBookings = asyncHandler(async (req, res) => {
  // Fetch all bookings from the database
  const bookings = await BookingModel.find()
    .populate('customer')
    .populate('service')
    .populate('slot')
    .exec();

  // Send the response
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'All bookings retrieved successfully',
    data: bookings,
  });
});

export const getUserBookings = asyncHandler(async (req, res) => {
  // Retrieve user ID from the request (assumed to be added in the request by auth middleware)
  const userId = req.user?._id;

  if (!userId) {
    throw new AppError(401, 'User not authenticated.');
  }

  // Fetch user's bookings from the database
  const bookings = await BookingModel.find({ customer: userId })
    .populate({
      path: "service",
      select: "_id name description price duration isDeleted",
    })
    .populate({
      path: "slot",
      select: "_id service date startTime endTime isBooked",
    })
    .exec();


  // Send the response
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User bookings retrieved successfully',
    data: bookings,
  });
});

export const BookingControllers = {
  createBooking, getAllBookings, getUserBookings
};
