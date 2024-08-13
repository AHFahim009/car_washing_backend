/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import { ErrorMessage } from "../middlewares/globalErrorHandler";

export const handleDuplicateError = (res: Response, err: any) => {
  const message = "Duplicate entry error"
  const success = false;
  const statusCode = 404;
  const errorMessages: ErrorMessage[] = [
    {
      message: err.errorResponse.errmsg,
      path: ""
    }

  ]

  const errorResponse = {
    message,
    success,
    errorMessages,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Include stack trace only in development mode
  }

  res.status(statusCode).json(errorResponse);

}