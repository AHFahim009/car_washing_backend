import { Response } from "express";

interface TResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  token?: string;
  data: T;
}

const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
  const { success, data, message, statusCode, token } = responseData;

  res.status(statusCode).json({
    success,
    message,
    token,
    data,
  });
};

export default sendResponse;
