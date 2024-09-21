/* eslint-disable @typescript-eslint/no-explicit-any */
import { addMinutes, differenceInMinutes, format } from "date-fns";
import { AppError } from "../../error/AppError";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import ServiceModel from "../ourService/ourService.model";
import { SlotModel } from "./slot.model";

export const createSlots = asyncHandler(async (req, res) => {
    const { service, date, startTime, endTime } = req.body;

    /*
     create slots logic:
     1. a payload will come for creating a slot for a service
     2. check if the selected service exists
     3. if service is valid, retrieve the service duration
     4. calculate how many slots can be created for the duration between the given time range
     5. ensure the slots can be created for the current or future date and time
     6. check for existing slots in the database within the time range
     7. throw errors for any validation failures with appropriate messages
     8. finally, create and save the slots for the service
    */

    // Validate the service exists and retrieve its duration
    const serviceDetails = await ServiceModel.findById(service);
    if (!serviceDetails) {
        throw new AppError(404, "Service not found");
    }

    const serviceDuration = serviceDetails.duration; // Assume duration is in minutes

    // Ensure the provided date is in the future or today
    const currentDate = new Date();
    const providedDate = new Date(date);
    const today = new Date(currentDate.setHours(0, 0, 0, 0));
    if (providedDate < today) {
        throw new AppError(400, "Cannot create slots for past dates");
    }

    // Parse startTime and endTime into Date objects
    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

    // Handle cases where the provided date is today, and ensure the start time is not in the past
    if (providedDate.getTime() === today.getTime()) {
        const currentTime = new Date(); // Current time
        if (start < currentTime) {
            throw new AppError(400, "Start time cannot be in the past for today");
        }
    }

    // Validate the start and end times
    if (end <= start) {
        throw new AppError(400, "End time must be after the start time");
    }

    // Calculate the total available time in minutes
    const totalDuration = differenceInMinutes(end, start);

    // Calculate the number of slots that can be created
    const numberOfSlots = Math.floor(totalDuration / serviceDuration);

    if (numberOfSlots < 1) {
        throw new AppError(400, "Insufficient time to create at least one slot");
    }

    // Initialize an array to store the new slots
    const slots = [];

    // Generate slot intervals and save them
    let currentStartTime = start;

    for (let i = 0; i < numberOfSlots; i++) {
        const currentEndTime = addMinutes(currentStartTime, serviceDuration);

        // Check for overlapping slots within the time range
        const existingSlot = await SlotModel.findOne({
            service,
            date,
            startTime: { $lte: format(currentEndTime, "HH:mm") },
            endTime: { $gte: format(currentStartTime, "HH:mm") },
        });

        if (existingSlot) {
            throw new AppError(
                409,
                "A slot already exists within the specified time range"
            );
        }

        // Create a new slot object
        const slot = new SlotModel({
            service,
            date,
            startTime: format(currentStartTime, "HH:mm"),
            endTime: format(currentEndTime, "HH:mm"),
            isBooked: "available",
        });

        // Add the newly created slot to the slots array
        slots.push(slot);

        // Move the current start time to the end of the newly created slot
        currentStartTime = currentEndTime;
    }

    // Save all slots to the database using insertMany for better performance
    const result = await SlotModel.insertMany(slots); // Changed to insertMany for batch insert

    // Send the response back to the client with slot details
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Slots created successfully",
        data: result,
    });
});


export const getAvailableSlots = asyncHandler(async (req, res) => {
    const { date, serviceId, isBooked } = req.query;

    // Validate the date format if provided
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date as string)) {
        throw new AppError(400, "Invalid date format. Use YYYY-MM-DD.");
    }

    // Validate serviceId if provided
    if (serviceId) {
        const isService = await ServiceModel.findById(serviceId);
        if (!isService) throw new AppError(400, "Invalid service ID.");
    }

    // Validate isBooked if provided
    const validStatuses = ["available", "booked", "canceled"];
    if (isBooked && !validStatuses.includes(isBooked as string)) {
        throw new AppError(
            400,
            `Invalid isBooked value. Use one of: ${validStatuses.join(", ")}.`
        );
    }

    // Build query conditions
    const query: any = {};
    if (date) query.date = date;
    if (serviceId) query.service = serviceId;
    if (isBooked) query.isBooked = isBooked;

    // Fetch slots from the database
    const slots = await SlotModel.find(query).populate("service").exec();

    // Process slots to remove those with isDeleted set to true
    const availableSlots = slots.filter((slot: any) => {
        const service = slot.service as { isDeleted: boolean };
        return !service.isDeleted;
    });

    // Send the response
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Available slots retrieved successfully",
        data: availableSlots,
    });
});

export const slotStatusChanged = asyncHandler(async (req, res) => {
    const { slotId } = req.params;

    // Find the slot by ID
    const slot = await SlotModel.findById(slotId);

    if (!slot) {
        throw new AppError(404, "Slot not found");
    }

    // Toggle the status
    slot.isBooked = slot.isBooked === "canceled" ? "available" : "canceled";

    // Save the updated slot
    await slot.save();

    // Send the response
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Status updated successfully",
        data: slot,
    });
});
export const slotStatus = asyncHandler(async (req, res) => {
    const { slotId } = req.params;

    // Find the slot by ID
    const slot = await SlotModel.findById(slotId);

    if (!slot) {
        throw new AppError(404, "Slot not found");
    }

    // Send the response
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "selected slot status",
        data: slot.isBooked,
    });
});

export const SlotControllers = {
    createSlots,
    getAvailableSlots,
    slotStatusChanged,
    slotStatus
};
