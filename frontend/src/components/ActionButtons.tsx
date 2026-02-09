import type  { ReactNode } from "react";
import { Button } from "@mui/material";

interface ActionButtonsProps {
    primaryLabel: string;
    primaryIcon?: ReactNode;
    onPrimaryClick: () => void;
    secondaryLabel?: string;
    secondaryIcon?: ReactNode;
    onSecondaryClick?: () => void;
    primaryDisabled?: boolean;
    primaryVariant?: "contained" | "outlined";
    layout?: "horizontal" | "vertical";
}

export default function ActionButtons({
    primaryLabel,
    primaryIcon,
    onPrimaryClick,
    secondaryLabel,
    secondaryIcon,
    onSecondaryClick,
    primaryDisabled = false,
    primaryVariant = "contained",
    layout = "horizontal"
}: ActionButtonsProps) {
    const containerClass = layout === "horizontal"
        ? "flex gap-4"
        : "flex flex-col gap-4";

    return (
        <div className={containerClass}>
            <Button
                variant={primaryVariant}
                fullWidth
                size="large"
                startIcon={primaryIcon}
                onClick={onPrimaryClick}
                disabled={primaryDisabled}
                className="bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case py-4 rounded-xl text-lg flex-1"
            >
                {primaryLabel}
            </Button>
            {secondaryLabel && onSecondaryClick && (
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={secondaryIcon}
                    onClick={onSecondaryClick}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case py-4 rounded-xl text-lg flex-1"
                >
                    {secondaryLabel}
                </Button>
            )}
        </div>
    );
}
