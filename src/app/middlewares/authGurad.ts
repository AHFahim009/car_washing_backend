import config from "../../config";
import { AppError } from "../error/AppError";
import UserModel from "../modules/auth/auth.model";
import asyncHandler from "../utils/asyncHandler";

import jwt, { JwtPayload } from "jsonwebtoken";

export const authGuard = ([...roles]: ["user" | "admin"]) => {
  return asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError(401, "No token provided");

    const token = authHeader.split(" ")[1];
    if (!token) throw new AppError(401, "Invalid token format");

    const verifyToken = jwt.verify(token, config.JWT_SECRET_TOKEN as string);
    if (!verifyToken) throw new AppError(403, "Token is not valid");

    const userCredentials = jwt.decode(token) as JwtPayload;
    const isUserExit = await UserModel.findById(userCredentials._id)
    if (!isUserExit) throw new AppError(403, "Sorry! You have no permission");


    if (roles && !roles.includes(userCredentials.role))
      throw new AppError(401, "You have no permission");
    // Attach user credentials to the request object
    req.user = userCredentials;
    next();
  });
};
