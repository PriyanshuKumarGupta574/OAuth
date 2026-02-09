import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  isVerified: boolean;
  emailOtp?: string;
  emailOtpExpires?: Date;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  googleId?: string;
  authProviders: ("local" | "google" | "github")[];
  githubId?: string;
  githubAccessToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
    },


    isVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: {
      type: String,
      select: false,
    },

    emailOtpExpires: {
      type: Date,
    },


    refreshToken: {
      type: String,
      select: false,
    },


    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
    },


    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },


    authProviders: {
      type: [String],
      enum: ["local", "google", "github"],
      default: ["local"],
    },

    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },

    githubAccessToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);


