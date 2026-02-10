import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
  register,
  login,
  verifyEmailOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken,
} from "../controller/auth.controller";
import { generateAccessToken, generateRefreshToken } from "../../common/services/jwt.service";
import { authLimiter } from "../../common/middleware/rate-limiter.middleware";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/verify-otp", authLimiter, verifyEmailOtp);
router.post("/resend-otp", authLimiter, resendOtp);
router.post("/login", authLimiter, login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPassword);
router.post("/refresh-token", authLimiter, refreshToken);
router.post("/logout", authLimiter, logout);


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user!;

    const accessToken = generateAccessToken({ id: user._id.toString() });
    const refreshToken = generateRefreshToken({ id: user._id.toString() });


    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`
    );
  }
);


export default router;


