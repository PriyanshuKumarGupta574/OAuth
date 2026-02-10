import dotenv from "dotenv";
dotenv.config({ path: "env.local" });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

import "./app/auth/config/passport";
import routes from "./app/route";
import folderRoutes from "./app/snippet/route/folder.routes";


const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(passport.initialize());

import { apiLimiter } from "./app/common/middleware/rate-limiter.middleware";
import { errorHandler } from "./app/common/middleware/error.middleware";

app.use("/api", apiLimiter, routes);


app.use("/api/folders", apiLimiter, folderRoutes);

app.use(errorHandler);


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
