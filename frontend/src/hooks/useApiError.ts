/**
 * Custom hook for consistent API error handling across components
 * Eliminates repetitive error extraction logic
 */
export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

export const useApiError = () => {
    /**
     * Extracts error message from API response
     * @param err - Error object from API call
     * @param defaultMessage - Fallback message if error message not found
     * @returns Formatted error message
     */
    const extractErrorMessage = (err: ApiError | string, defaultMessage: string): string => {
        if (typeof err === "string") return err;
        return err?.response?.data?.message || err?.message || defaultMessage;
    };

    return { extractErrorMessage };
};
