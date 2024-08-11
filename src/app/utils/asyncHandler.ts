import { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler = (asyncFn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFn(req, res, next)).catch((error) => next(error));
  };
};

export default asyncHandler;
