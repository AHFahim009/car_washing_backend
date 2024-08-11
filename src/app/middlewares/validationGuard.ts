import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validationGuard = (payloadSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await payloadSchema.parseAsync(req.body).then(() => next()).catch((error) => next(error))
  };
};

export default validationGuard;
