import type  { ReactNode } from "react";

interface FormCardProps {
    children: ReactNode;
    maxWidth?: string;
}

export default function FormCard({ children, maxWidth = "max-w-[600px]" }: FormCardProps) {
    return (
        <div className={`${maxWidth} mx-auto mt-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl`}>
            {children}
        </div>
    );
}
