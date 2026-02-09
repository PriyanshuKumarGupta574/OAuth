import { Request } from "express";
import mongoose from "mongoose";

declare global {
    namespace Express {
        interface User {
            _id: mongoose.Types.ObjectId | string;
            email: string;
            name?: string;
        }
    }
}

export interface RequestWithUser extends Request {
    user: {
        _id: mongoose.Types.ObjectId | string;
        email: string;
        name?: string;
    };
}
