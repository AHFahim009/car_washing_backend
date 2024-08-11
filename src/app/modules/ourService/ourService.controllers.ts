import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { TOurService } from "./ourService.interface";
import ServiceModel from "./ourService.model";

export const createService = asyncHandler(async (req, res) => {
  // Destructure validated data
  const payload: TOurService = req.body

  const result = await ServiceModel.create(payload)

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Service created successfully',
    data: result
  });
})


export const OurServiceControllers = {
  createService
}