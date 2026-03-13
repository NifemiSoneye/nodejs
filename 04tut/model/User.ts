import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/index";

interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: {
      type: Number,
    },
    Admin: {
      type: Number,
    },
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

export default mongoose.model<IUserDocument>("User", userSchema);
