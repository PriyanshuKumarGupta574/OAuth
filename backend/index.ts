import dotenv from "dotenv";
dotenv.config({ path: "env.local" }); // MUST be first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

import "./app/auth/config/passport";
import routes from "./app/route";
import folderRoutes from "./app/snippet/route/folder.routes";


const app = express();

/* ======================================================
   MIDDLEWARE
====================================================== */

// ✅ Allow frontend + cookies (refresh token)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Parse JSON body
app.use(express.json());

// ✅ Parse cookies (REQUIRED for refresh tokens)
app.use(cookieParser());

// ✅ Passport (Google OAuth)
app.use(passport.initialize());

/* ======================================================
   ROUTES
====================================================== */
app.use("/api", routes);


app.use("/api/folders", folderRoutes);

/* ======================================================
   DATABASE + SERVER
====================================================== */
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT || 5000}`
      );
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
