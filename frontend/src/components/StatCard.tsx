import type { ReactNode } from "react";
import { Typography } from "@mui/material";

interface StatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    gradient: string;
    border: string;
}

export default function StatCard({ title, value, icon, gradient, border }: StatCardProps) {
    return (
        <div
            className={`p-8 rounded-3xl bg-gradient-to-br ${gradient} border ${border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group`}
        >
            <div className="mb-4 p-4 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <Typography variant="h3" className="font-extrabold text-slate-800 tracking-tight">
                {value}
            </Typography>
            <Typography variant="body2" className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
                {title}
            </Typography>
        </div>
    );
}
