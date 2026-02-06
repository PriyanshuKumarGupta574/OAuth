import { Router } from "express";
import passport from "passport";
import authRoutes from "./auth/routes/auth.routes";
import {
  generateAccessToken,
  generateRefreshToken
  
  
  
  ,
} from "./common/services/jwt.service";
import snippetRoutes from "./snippet/route/snippet.route";



const router = Router();


router.use("/auth", authRoutes);
router.use("/snippets", snippetRoutes);
router.use("/api/snippet", snippetRoutes);






router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req: any, res) => {
    const user = req.user;

  
    const accessToken = generateAccessToken({
      id: user._id.toString(),
    });

    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
    });

    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",   
      secure: false,
   
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`
    );
  }
);



export default router;


