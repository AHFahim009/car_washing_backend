/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import sendResponse from '../../utils/sendResponse';
import UserModel from './auth.model';
import { TUser } from './auth.interface';
import { AppError } from '../../error/AppError';
import jwt from "jsonwebtoken"
import config from '../../../config';

// Define the function to create a user
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  // Destructure request body
  const payload: TUser = req.body;
  payload.role = "admin";
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  payload.password = hashedPassword
  // Use Mongoose's create method to save the user to the database
  const result = await UserModel.create(payload);
  const { password, ...userData } = result.toObject();

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User registered successfully',
    data: userData
  });
});


export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(401, "Invalid email or password")
  }

  // Check if the password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(401, "Invalid email or password")
  }

  // Generate JWT token
  const jwtPayload = {
    _id: user._id, email: user.email, role: user.role
  }

  // Generate the token
  const token = jwt.sign(
    jwtPayload,
    config.JWT_SECRET_TOKEN as string,
    {
      algorithm: 'HS256',
      expiresIn: '1h'
    }
  );

  // Omitting the password field using destructuring and the rest operator
  const { password: _, ...userData } = user.toObject();

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User logged in successfully',
    token,
    data: userData,
  });
});



export const AuthControllers = {
  createUser,
  userLogin
}