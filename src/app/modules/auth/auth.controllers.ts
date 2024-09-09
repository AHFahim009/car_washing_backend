/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import UserModel from "./auth.model";
import { TUser } from "./auth.interface";
import { AppError } from "../../error/AppError";
import jwt from "jsonwebtoken";
import config from "../../../config";
import uploadToCloudinary from "../../utils/cloudinary";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";




export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const payload: TUser = req.body;


    // Upload photo to Cloudinary if provided
    if (req.file) {
      const photoPath = req.file.path;
      const photoName = `user_${payload.email}_/_carWashingProject_photo`;
      const { optimizedUrl } = await uploadToCloudinary(photoPath, photoName);
      payload.photo = optimizedUrl; // Assuming `photoUrl` is the field for the photo URL
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashedPassword;

    // Create user with the payload
    const result = await UserModel.create([payload], { session });
    const { password, ...userData } = result[0].toObject();

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send response back to client
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User registered successfully",
      data: userData,
    });
  } catch (error) {
    // Abort transaction if error occurs
    await session.abortTransaction();
    session.endSession();
    next(error);

  }
});


const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  // Check if the password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(401, "Invalid email or password");
  }

  // Generate JWT token
  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  // Generate the token
  const token = jwt.sign(jwtPayload, config.JWT_SECRET_TOKEN as string, {
    algorithm: "HS256",
    expiresIn: config.JWT_SECRET_TOKEN_ExpiresIn,
  });

  // Omitting the password field using destructuring and the rest operator
  const { password: _, ...userData } = user.toObject();

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    token,
    data: userData,
  });
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  // Fetch all users from the database
  const users = await UserModel.find();

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrieved successfully",
    data: users,
  });
});

const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  // Fetch the user by ID from the database
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(404, "user not found");
  }

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrieved successfully",
    data: user,
  });
});

export const updateUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;

    // Find the user by ID and update their role
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      throw new AppError(404, "user not found");
    }

    // Send response back to client
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User role updated successfully",
      data: user,
    });
  }
);

const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const payload: Partial<TUser> = req.body;

    // Find the user in the database
    const user = await UserModel.findById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    // Upload new photo to Cloudinary if provided
    if (req.file) {
      const photoPath = req.file.path;
      const photoName = `user_${user.email}_/_carWashingProject_photo`;

      // If the user already has a photo, delete the old one from Cloudinary
      if (user.photo) {
        const oldPhotoPublicId = extractPublicIdFromUrl(user.photo); // You need to implement this function to get the public_id from the URL
        await cloudinary.uploader.destroy(oldPhotoPublicId); // Delete the old photo
      }

      // Upload the new photo and overwrite any existing one
      const { optimizedUrl } = await uploadToCloudinary(photoPath, photoName);
      payload.photo = optimizedUrl; // Update payload with new photo URL
    }

    // Update the user in the database
    const updatedUser = await UserModel.findByIdAndUpdate(id, payload, {
      new: true, // Return the updated document
      session,
      runValidators: true, // Ensure validators run during update
    });

    if (!updatedUser) {
      throw new AppError(404, "User not found");
    }

    const { password, ...userData } = updatedUser.toObject();

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send response back to the client
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User updated successfully",
      data: userData,
    });
  } catch (error) {
    // Abort transaction if error occurs
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

// Helper function to extract public_id from the Cloudinary URL
const extractPublicIdFromUrl = (url: string) => {
  const parts = url.split('/');
  return parts[parts.length - 1].split('.')[0]; // Extract public_id (last part of the URL without extension)
};





const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  // Fetch the user by ID from the database
  const user = await UserModel.deleteOne({ _id: userId });

  if (!user) {
    throw new AppError(404, "user not found");
  }

  // Send response back to client
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrieved successfully",
    data: user,
  });
});
// do


export const AuthControllers = {
  createUser,
  userLogin,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUserById,
  updateUser
};
