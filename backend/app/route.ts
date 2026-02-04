import { Router } from "express";
import passport from "passport";
import authRoutes from "./auth/routes/auth.routes";
import {
  generateAccessToken,
  generateRefreshToken
  
  
  
  ,
} from "./common/services/jwt.service";

const router = Router();

/* ================= NORMAL AUTH ROUTES ================= */
router.use("/auth", authRoutes);

/* ================= GOOGLE OAUTH ================= */

// Step 1: redirect to Google
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Step 2: Google callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req: any, res) => {
    const user = req.user;

    // 🔑 Generate tokens
    const accessToken = generateAccessToken({
      id: user._id.toString(),
    });

    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
    });

    // 🍪 Store refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",   // 🔥 IMPORTANT
      secure: false,
    //   sameSite: "strict",
    //   secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Redirect with access token
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`
    );
  }
);

export default router;


// import { Router } from "express";
// import authRoutes from "./auth/routes/auth.routes";

// const router = Router();

// router.use("/auth", authRoutes);

// export default router;
