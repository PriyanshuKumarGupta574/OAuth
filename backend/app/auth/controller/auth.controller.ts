import { Request, Response } from "express";
import User from "../schemas/user.schema";
import jwt from "jsonwebtoken";

import { sendOtpEmail } from "../../common/services/email.service";
import {
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service";

import {
  hashPassword,
  comparePassword,
  generateOtp,
  hashOtp,
} from "../../common/helper/otp.helper";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/services/jwt.service";
import { catchError } from "../../common/middleware/catch-error.middleware";

export const register = catchError(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email & password required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const otp = generateOtp();

  await User.create({
    email,
    password: await hashPassword(password),
    isVerified: false,
    emailOtp: hashOtp(otp),
    emailOtpExpires: new Date(Date.now() + 10 * 60 * 1000),
    authProviders: ["local"],
  });

  await sendOtpEmail(email, otp);

  res.status(201).json({
    message: "OTP sent to email",
    email,
  });
});

export const verifyEmailOtp = catchError(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    emailOtp: hashOtp(otp),
    emailOtpExpires: { $gt: new Date() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  user.isVerified = true;
  user.emailOtp = undefined;
  user.emailOtpExpires = undefined;
  await user.save();

  const accessToken = generateAccessToken({ id: user._id.toString() });
  const refreshToken = generateRefreshToken({ id: user._id.toString() });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

export const resendOtp = catchError(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.isVerified) {
    res.status(400);
    throw new Error("Cannot resend OTP");
  }

  const otp = generateOtp();

  user.emailOtp = hashOtp(otp);
  user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOtpEmail(email, otp);

  res.json({ message: "OTP resent successfully" });
});

export const login = catchError(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  if (!user.authProviders.includes("local")) {
    res.status(400);
    throw new Error("Use Google login for this account");
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error("Email not verified");
  }

  const isMatch = await comparePassword(password, user.password!);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken({ id: user._id.toString() });
  const refreshToken = generateRefreshToken({ id: user._id.toString() });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

export const refreshToken = catchError(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error("No refresh token");
  }

  const payload = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  ) as { id: string };

  const accessToken = generateAccessToken({ id: payload.id });

  return res.json({ accessToken });
});

export const logout = catchError(async (_: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

export const forgotPassword = catchError(async (req: Request, res: Response) => {
  await forgotPasswordService(req.body.email);
  res.json({ message: "Reset link sent if email exists" });
});

export const resetPassword = catchError(async (req: Request, res: Response) => {
  await resetPasswordService(req.params.token as string, req.body.password);
  res.json({ message: "Password reset successful" });
});
