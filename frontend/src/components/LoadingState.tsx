import { CircularProgress, Typography } from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";

interface LoadingStateProps {
    message?: string;
    useLayout?: boolean;
}

export default function LoadingState({ message, useLayout = true }: LoadingStateProps) {
    const content = (
        <div className="flex flex-col items-center justify-center mt-20 gap-4">
            <CircularProgress />
            {message && (
                <Typography className="text-slate-500 font-medium">
                    {message}
                </Typography>
            )}
        </div>
    );

    if (useLayout) {
        return <DashboardLayout>{content}</DashboardLayout>;
    }

    return content;
}
