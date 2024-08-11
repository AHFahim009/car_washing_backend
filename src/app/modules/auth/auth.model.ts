import mongoose, { Schema } from 'mongoose';
import { TUser } from './auth.interface';


// Create the Mongoose schema for a User
const UserSchema: Schema = new Schema<TUser>({
  name: {
    type: String,
    required: true,
    trim: true, // Trims whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true
});

// Create a Mongoose model using the schema
const UserModel = mongoose.model<TUser>('User', UserSchema);

export default UserModel;
