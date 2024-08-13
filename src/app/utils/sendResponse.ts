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

  const finalMessage =
    data && Array.isArray(data) && data.length === 0
      ? "No Data Found"
      : message;
  res.status(statusCode).json({
    success,
    message: finalMessage,
    token,
    data,
  });
};

export default sendResponse;
