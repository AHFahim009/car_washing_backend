/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { AppError } from '../error/AppError';

interface ErrorMessage {
  path: string;
  message: string;
}

interface ErrorResponse {
  success: boolean;
  message: string;
  errorMessages: ErrorMessage[];
  stack?: string; // Optional stack trace
  error?: any
}

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const success = false;

  let statusCode = 500;
  let message = err.message || 'Something went wrong!'

  // Create error messages array
  const errorMessages: ErrorMessage[] = [{
    path: "",
    message: ""
  }];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }


  // Create the error response object
  const errorResponse: ErrorResponse = {
    success,
    message,
    errorMessages,
    error: err,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace only in development mode
  };

  return res.status(statusCode).json(errorResponse);
};
