
export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message?: string;
}

export const useApiError = () => {
    
    const extractErrorMessage = (err: ApiError | string, defaultMessage: string): string => {
        if (typeof err === "string") return err;
        return err?.response?.data?.message || err?.message || defaultMessage;
    };

    return { extractErrorMessage };
};
