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
} from "../controller/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyEmailOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as any;

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    );

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}`
    );
  }
);

export default router;


