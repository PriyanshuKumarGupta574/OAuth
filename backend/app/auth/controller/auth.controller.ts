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

/* ================= REGISTER ================= */

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

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
  } catch {
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= VERIFY EMAIL OTP ================= */

export const verifyEmailOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    emailOtp: hashOtp(otp),
    emailOtpExpires: { $gt: new Date() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired OTP" });

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
};

/* ================= RESEND OTP ================= */

export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.isVerified)
    return res.status(400).json({ message: "Cannot resend OTP" });

  const otp = generateOtp();

  user.emailOtp = hashOtp(otp);
  user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOtpEmail(email, otp);

  res.json({ message: "OTP resent successfully" });
};

/* ================= LOGIN ================= */

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");


  if (!user)
    return res.status(400).json({ message: "Invalid credentials" });

  if (!user.authProviders.includes("local"))
    return res
      .status(400)
      .json({ message: "Use Google login for this account" });

  if (!user.isVerified)
    return res.status(403).json({ message: "Email not verified" });

  const isMatch = await comparePassword(password, user.password!);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken({ id: user._id.toString() });
  const refreshToken = generateRefreshToken({ id: user._id.toString() });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};

/* ================= REFRESH TOKEN ================= */
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  console.log("Refresh token:", token);

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as any;

    const accessToken = generateAccessToken({ id: payload.id });

    return res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};


// export const refreshToken = async (req: Request, res: Response) => {
//   const token = req.cookies.refreshToken;
//   if (!token)
//     return res.status(401).json({ message: "No refresh token" });

//   try {
//     const payload = jwt.verify(
//       token,
//       process.env.JWT_REFRESH_SECRET!
//     ) as any;

//     const newAccessToken = generateAccessToken({ id: payload.id });
//     res.json({ accessToken: newAccessToken });
//   } catch {
//     res.status(403).json({ message: "Invalid refresh token" });
//   }
//};

/* ================= LOGOUT ================= */

export const logout = async (_: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

/* ================= PASSWORD RESET ================= */

export const forgotPassword = async (req: Request, res: Response) => {
  await forgotPasswordService(req.body.email);
  res.json({ message: "Reset link sent if email exists" });
};

export const resetPassword = async (req: Request, res: Response) => {
  await resetPasswordService(req.params.token as string , req.body.password);
  res.json({ message: "Password reset successful" });
};


// import { Request, Response } from "express";
// import User from "../schemas/user.schema";
// import jwt from "jsonwebtoken";

// import { sendOtpEmail } from "../../common/services/email.service";
// import {
//   forgotPasswordService,
//   resetPasswordService,
// } from "../services/auth.service";

// import {
//   hashPassword,
//   comparePassword,
//   generateOtp,
//   hashOtp,
// } from "../../common/helper/otp.helper";


// const generateAccessToken = (userId: string) =>
//   jwt.sign(
//     { id: userId },
//     process.env.JWT_ACCESS_SECRET!,
//     { expiresIn: "15m" }
//   );

// const generateRefreshToken = (userId: string) =>
//   jwt.sign(
//     { id: userId },
//     process.env.JWT_REFRESH_SECRET!,
//     { expiresIn: "7d" }
//   );


// export const register = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ message: "Email & password required" });

//   const exists = await User.findOne({ email });
//   if (exists)
//     return res.status(400).json({ message: "User already exists" });

//   const otp = generateOtp();
//   const hashedPassword = await hashPassword(password);

//   await User.create({
//     email,
//     password: hashedPassword,
//     isVerified: false,
//     emailOtp: hashOtp(otp),
//     emailOtpExpires: new Date(Date.now() + 10 * 60 * 1000),
//     authProviders: ["local"],
//   });

//   await sendOtpEmail(email, otp);

//   res.status(201).json({
//     message: "OTP sent to email",
//     email,
//   });
// };


// export const verifyEmailOtp = async (req: Request, res: Response) => {
//   const { email, otp } = req.body;

//   const user = await User.findOne({
//     email,
//     emailOtp: hashOtp(otp),
//     emailOtpExpires: { $gt: new Date() },
//   });

//   if (!user)
//     return res.status(400).json({ message: "Invalid or expired OTP" });

//   user.isVerified = true;
//   user.emailOtp = undefined;
//   user.emailOtpExpires = undefined;
//   await user.save();

//   const accessToken = generateAccessToken(user._id.toString());
//   const refreshToken = generateRefreshToken(user._id.toString());

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     sameSite: "strict",
//     secure: false, 
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   res.json({ accessToken });
// };


// export const resendOtp = async (req: Request, res: Response) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });
//   if (!user || user.isVerified)
//     return res.status(400).json({ message: "Cannot resend OTP" });

//   const otp = generateOtp();

//   user.emailOtp = hashOtp(otp);
//   user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
//   await user.save();

//   await sendOtpEmail(email, otp);

//   res.json({ message: "OTP resent successfully" });
// };


// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user || !user.password)
//     return res.status(400).json({ message: "Invalid credentials" });

//   if (!user.isVerified)
//     return res.status(403).json({ message: "Email not verified" });

//   const isMatch = await comparePassword(password, user.password);
//   if (!isMatch)
//     return res.status(400).json({ message: "Invalid credentials" });

//   const accessToken = generateAccessToken(user._id.toString());
//   const refreshToken = generateRefreshToken(user._id.toString());

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     sameSite: "strict",
//     secure: false,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });

//   res.json({ accessToken });
// };

// export const refreshToken = async (req: Request, res: Response) => {
//   const token = req.cookies.refreshToken;

//   if (!token)
//     return res.status(401).json({ message: "No refresh token" });

//   try {
//     const payload = jwt.verify(
//       token,
//       process.env.JWT_REFRESH_SECRET!
//     ) as any;

//     const newAccessToken = generateAccessToken(payload.id);
//     res.json({ accessToken: newAccessToken });
//   } catch {
//     res.status(403).json({ message: "Invalid refresh token" });
//   }
// };


// export const logout = async (_: Request, res: Response) => {
//   res.clearCookie("refreshToken");
//   res.json({ message: "Logged out" });
// };


// export const forgotPassword = async (req: Request, res: Response) => {
//   await forgotPasswordService(req.body.email);
//   res.json({ message: "Reset link sent if email exists" });
// };

// export const resetPassword = async (req: Request, res: Response) => {
//   await resetPasswordService(req.params.token as string, req.body.password);
//   res.json({ message: "Password reset successful" });
// };


