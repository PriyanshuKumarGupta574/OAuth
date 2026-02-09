import { Request } from "express";
import mongoose from "mongoose";

export const getUserId = (req: Request): string => {
    if (!req.user || !req.user._id) {
        throw new Error("User not authenticated");
    }

    const userId = req.user._id;


    if (typeof userId === "string") {
        return userId;
    }

    
    return userId.toString();
};


export const getUserIdOptional = (req: Request): string | undefined => {
    if (!req.user || !req.user._id) {
        return undefined;
    }

    const userId = req.user._id;

    
    if (typeof userId === "string") {
        return userId;
    }

    return userId.toString();
};


 
export const getParamId = (req: Request, paramName: string = "id"): string => {
    return req.params[paramName] as string;
};


export const getQueryParam = (req: Request, queryName: string): string | undefined => {
    const value = req.query[queryName];
    return value ? (value as string) : undefined;
};
