import { Request, Response, NextFunction } from "express";

export const handleError = (
    res: Response,
    error: unknown,
    defaultMessage: string,
    statusCode: number = 500
): void => {
    const err = error as Error;
    res.status(statusCode).json({
        message: err.message || defaultMessage
    });
};


type AsyncController = (req: Request, res: Response, next?: NextFunction) => Promise<unknown>;


type ErrorHandler = (res: Response, error: unknown) => void;

export const asyncHandler = (
    fn: AsyncController,
    customErrorHandler?: ErrorHandler
) => {
    return (req: Request, res: Response, next?: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            if (customErrorHandler) {
                customErrorHandler(res, error);
            } else {
                handleError(res, error, "Internal server error");
            }
        });
    };
};

