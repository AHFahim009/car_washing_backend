import { ZodError } from "zod";
import { ErrorMessage } from "../middlewares/globalErrorHandler";
import { Response } from "express";

export const handelZodError = (res: Response, err: ZodError) => {
  const message = "Validation error";
  const success = false;
  const statusCode = 404;

  const errorMessages = err.issues.map((issue): ErrorMessage => {
    return {
      message: issue.path.join("."),
      path: issue.message
    }
  })
  const issues = err.issues


  const errorResponse = {
    success,
    message,
    errorMessages,
    issues,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Include stack trace only in development mode
  }

  res.status(statusCode).json(errorResponse);
}