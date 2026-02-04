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

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyEmailOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as any;

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    
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


