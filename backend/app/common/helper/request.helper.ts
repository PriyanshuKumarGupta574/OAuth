import { Request } from "express";
import mongoose from "mongoose";

/**
 * Extract and convert user ID from authenticated request to string
 * Handles both ObjectId and string types
 * @throws Error if user is not authenticated
 */
export const getUserId = (req: Request): string => {
    if (!req.user || !req.user._id) {
        throw new Error("User not authenticated");
    }

    const userId = req.user._id;

    // Handle both ObjectId and string types
    if (typeof userId === "string") {
        return userId;
    }

    // Handle ObjectId type
    return userId.toString();
};

/**
 * Extract and convert user ID from request to string, returns undefined if not authenticated
 * Handles both ObjectId and string types
 */
export const getUserIdOptional = (req: Request): string | undefined => {
    if (!req.user || !req.user._id) {
        return undefined;
    }

    const userId = req.user._id;

    // Handle both ObjectId and string types
    if (typeof userId === "string") {
        return userId;
    }

    // Handle ObjectId type
    return userId.toString();
};

/**
 * Extract route parameter and cast to string
 * @param req Express request object
 * @param paramName Name of the parameter (defaults to 'id')
 */
export const getParamId = (req: Request, paramName: string = "id"): string => {
    return req.params[paramName] as string;
};

/**
 * Extract query parameter and cast to string
 * @param req Express request object
 * @param queryName Name of the query parameter
 */
export const getQueryParam = (req: Request, queryName: string): string | undefined => {
    const value = req.query[queryName];
    return value ? (value as string) : undefined;
};
