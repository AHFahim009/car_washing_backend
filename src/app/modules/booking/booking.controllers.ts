/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../../error/AppError";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import ServiceModel from "../ourService/ourService.model";
import { SlotModel } from "../slot/slot.model";
import BookingModel from "./booking.model";

export const createBooking = asyncHandler(async (req, res) => {
  // const userId = req.user?._id;
  // if (!userId) throw new AppError(404, "you have no permission");
  const {
    service,
    slot,
    vehicleType,
    vehicleBrand,
    vehicleModel,
    manufacturingYear,
    registrationPlate,
    customer
  } = req.body;

  // Check if the slot exists and is available
  const isSlot = await SlotModel.findById(slot).populate("service");
  console.log(isSlot);

  if (!isSlot) {
    throw new AppError(404, "Slot not found.");
  }
  console.log(isSlot.isBooked);

  if (isSlot.isBooked === "booked" || isSlot.isBooked === "canceled") {
    throw new AppError(400, "Slot is not available for booking.");
  }

  // Check if the service exists
  const isService = isSlot.service._id as any;
  console.log("isService", isService);

  const serviceExists = await ServiceModel.findOne({ _id: isService, isDeleted: false });
  if (!serviceExists) {
    throw new AppError(404, "Service not found or is deleted.");
  }


  // Create the booking
  const booking = await BookingModel.create({
    customer: customer,
    service: service,
    slot: slot,
    vehicleType,
    vehicleBrand,
    vehicleModel,
    manufacturingYear,
    registrationPlate,
  });

  // Update the slot to 'booked'
  isSlot.isBooked = "booked";
  await isSlot.save();

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
