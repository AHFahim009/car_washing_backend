/* eslint-disable @typescript-eslint/no-explicit-any */
import { addMinutes, differenceInMinutes, format } from "date-fns";
import { AppError } from "../../error/AppError";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import ServiceModel from "../ourService/ourService.model";
import { SlotModel } from "./slot.model";

export const createSlots = asyncHandler(async (req, res) => {
  const { service, date, startTime, endTime } = req.body;

  // Validate the service exists and retrieve its duration
  const serviceDetails = await ServiceModel.findById(service);
  if (!serviceDetails) {
    throw new AppError(404, "Service not found");
  }

  const serviceDuration = serviceDetails.duration; // Assume duration is in minutes

  // Parse startTime and endTime into Date objects
  const start = new Date(`${date}T${startTime}:00`);
  const end = new Date(`${date}T${endTime}:00`);

  // Calculate the total duration in minutes
  const totalDuration = differenceInMinutes(end, start);

  // Calculate the number of slots
  const numberOfSlots = totalDuration / serviceDuration;

  // Initialize an array to store the slots
  const slots = [];

  // Generate slot intervals and save them
  let currentStartTime = start;
  for (let i = 0; i < numberOfSlots; i++) {
    const currentEndTime = addMinutes(currentStartTime, serviceDuration);

    // Check for existing slots within the time range
    const existingSlot = await SlotModel.findOne({
      service,
      date,
      startTime: { $lte: format(currentEndTime, "HH:mm") },
      endTime: { $gte: format(currentStartTime, "HH:mm") }
    });

    if (existingSlot) {
      throw new AppError(409, "A slot already exists within the specified time range");
    }


    const slot = new SlotModel({
      service,
      date,
      startTime: format(currentStartTime, "HH:mm"),
      endTime: format(currentEndTime, "HH:mm"),
      isBooked: "available",
    });

    slots.push(slot);
    currentStartTime = currentEndTime;
  }

  // Save all slots to the database
  const result = await SlotModel.create(slots);

  // Send the response back to the client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Slots created successfully",
    data: result,
  });
});


export const getAvailableSlots = asyncHandler(async (req, res) => {

  const { date, serviceId } = req.query;

  // Validate the date format if provided
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date as string)) {
    throw new AppError(400, 'Invalid date format. Use YYYY-MM-DD.')
  }

  // Validate serviceId if provided
  if (serviceId) {
    const isService = await ServiceModel.findById(serviceId)
    if (!isService) throw new AppError(400, 'Invalid service ID.')
  }

  // Build query conditions
  const query: any = {};
  if (date) query.date = date;
  if (serviceId) query.service = serviceId;

  // Fetch slots from the database
  const slots = await SlotModel.find(query).populate('service').exec();

  // Process slots to remove those with isDeleted set to true
  // Filter available slots where service is not deleted and slot is either available or canceled
  const availableSlots = slots.filter((slot: any) => {
    const service = slot.service as { isDeleted: boolean };
    return !service.isDeleted && (slot.isBooked === 'available' || slot.isBooked === 'canceled');
  });

  // Send the response
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Available slots retrieved successfully',
    data: availableSlots
  });





})



export const SlotControllers = {
  createSlots,
  getAvailableSlots
};
