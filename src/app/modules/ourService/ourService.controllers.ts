import { AppError } from "../../error/AppError";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { TOurService } from "./ourService.interface";
import ServiceModel from "./ourService.model";

export const createService = asyncHandler(async (req, res) => {
  // Destructure validated data
  const payload: TOurService = req.body;

  const result = await ServiceModel.create(payload);

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service created successfully",
    data: result,
  });
});

export const getService = asyncHandler(async (req, res) => {
  const serviceId = req.params.id;

  // Find the service by ID and ensure it's not soft deleted
  const service = await ServiceModel.findOne({ _id: serviceId, isDeleted: false });

  if (!service) {
    throw new AppError(404, "Service not found or has been deleted");
  }

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service retrieved successfully",
    data: service,
  });
});

export const getAllServices = asyncHandler(async (req, res) => {
  // Find all services that are not marked as deleted
  const services = await ServiceModel.find({ isDeleted: false });

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Services retrieved successfully",
    data: services,
  });
});

export const updateService = asyncHandler(async (req, res) => {
  const serviceId = req.params.id;

  // Find and update the service
  const updatedService = await ServiceModel.findByIdAndUpdate(
    serviceId,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedService) {
    throw new AppError(404, "Service not found");
  }

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service updated successfully",
    data: updatedService,
  });
});

export const deleteService = asyncHandler(async (req, res) => {
  const serviceId = req.params.id;

  // Soft delete the service by setting `isDeleted` to true
  const deletedService = await ServiceModel.findByIdAndUpdate(
    serviceId,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedService) {
    throw new AppError(404, "Service not found");
  }

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Service deleted successfully",
    data: deletedService,
  });
});

export const OurServiceControllers = {
  createService,
  getService,
  getAllServices,
  updateService,
  deleteService,
};
