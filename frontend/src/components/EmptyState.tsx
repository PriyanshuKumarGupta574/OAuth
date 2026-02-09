import type { ReactNode } from "react";
import { Typography } from "@mui/material";

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
    return (
        <div className="bg-slate-50 p-12 rounded-3xl border border-dashed border-slate-300 text-center">
            {icon && <div className="mb-4 text-4xl">{icon}</div>}
            <Typography variant="h6" className="text-slate-800 font-bold mb-2">
                {title}
            </Typography>
            {description && (
                <Typography className="text-slate-500">
                    {description}
                </Typography>
            )}
        </div>
    );
}
