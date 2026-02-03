import { Schema, model } from "mongoose";

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
    },

   
    authProviders: {
      type: [String],
      default: [], 
      enum: ["local", "google"],
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);


