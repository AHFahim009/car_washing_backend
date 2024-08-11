import { z } from "zod";

// Define the Zod schema for user validation
const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).trim(),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .trim(),
  role: z.enum(["admin", "user"], {
    message: "Role must be either admin or user",
  }),
  address: z.string().min(1, { message: "Address is required" }).trim(),
});
const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z.string(),
});

export const AuthValidation = {
  UserSchema,
  LoginSchema,
};
