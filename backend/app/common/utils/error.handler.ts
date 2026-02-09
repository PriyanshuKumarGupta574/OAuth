import { Request, Response, NextFunction } from "express";

/**
 * Standardized error response handler
 */
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

/**
 * Type for async controller functions
 */
type AsyncController = (req: Request, res: Response, next?: NextFunction) => Promise<>;

/**
 * Type for custom error handler
 */
type ErrorHandler = (res: Response, error: unknown) => void;

/**
 * Async controller wrapper to eliminate try-catch repetition
 * Wraps async route handlers and automatically catches errors
 * 
 * @param fn - Async controller function
 * @param customErrorHandler - Optional custom error handler
 * 
 * @example
 * export const getSnippet = asyncHandler(async (req, res) => {
 *   const snippet = await getSnippetService(req.params.id);
 *   res.json(snippet);
 * });
 * 
 * @example with custom error handler
 * export const deleteSnippet = asyncHandler(
 *   async (req, res) => {
 *     await deleteSnippetService(req.params.id);
 *     res.json({ message: "Deleted" });
 *   },
 *   (res, error) => handleError(res, error, "Delete failed", 403)
 * );
 */
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

