import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite in dev
const User = models.User || model<IUser>("User", UserSchema);

export default User;