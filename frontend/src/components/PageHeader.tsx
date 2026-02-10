import type { ReactNode } from "react";
import { Typography } from "@mui/material";

interface PageHeaderProps {
    title: string;
    icon: ReactNode;
    iconBgColor?: string;
    actions?: ReactNode;
}

export default function PageHeader({
    title,
    icon,
    iconBgColor = "bg-blue-50 text-[#1a73e8]",
    actions
}: PageHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${iconBgColor}`}>
                    {typeof icon === "string" ? (
                        <span className="text-3xl">{icon}</span>
                    ) : (
                        icon
                    )}
                </div>
                <Typography variant="h4" className="font-extrabold text-slate-800">
                    {title}
                </Typography>
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
        </div>
    );
}
