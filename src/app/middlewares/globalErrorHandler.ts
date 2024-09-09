/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { AppError } from "../error/AppError";
import { handelZodError } from "../handleError/handleZodError";
import { handleDuplicateError } from "../handleError/handleDuplicateError";
import { handleCastError } from "../handleError/hanldeCastErrro";

export interface ErrorMessage {
  path: string;
  message: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  errorMessages: ErrorMessage[];
  stack?: string; // Optional stack trace
}

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  const success = false;

  const statusCode = 500;
  const message = err.message || "Something went wrong!";

  // Create error messages array
  const errorMessages: ErrorMessage[] = [
    {
      path: "",
      message: "",
    },
  ];

  if (err instanceof AppError) {
    const statusCode = err.statusCode;
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });

    return;
  }
  if (err.name === "ZodError") {
    return handelZodError(res, err);
  }
  if (err.code === 11000) {
    return handleDuplicateError(res, err);
  }
  if (err.name === "CastError") {
    return handleCastError(res, err);
  }

  // Create the  generic error response object
  const errorResponse: ErrorResponse = {
    success,
    message,
    errorMessages,

    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Include stack trace only in development mode
  };

  return res.status(statusCode).json(errorResponse);
};
