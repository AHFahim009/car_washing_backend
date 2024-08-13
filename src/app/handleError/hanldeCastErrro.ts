/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import { ErrorMessage } from "../middlewares/globalErrorHandler";

export const handleCastError = (res: Response, err: any) => {
  const message = "Cast error"
  const success = false;
  const statusCode = 404;
  const errorMessages: ErrorMessage[] = [
    {
      path: "",
      message: err.message

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