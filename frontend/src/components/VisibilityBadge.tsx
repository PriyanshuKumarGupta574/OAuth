import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";

interface VisibilityBadgeProps {
    visibility: "public" | "private" | "team";
}

export default function VisibilityBadge({ visibility }: VisibilityBadgeProps) {
    const config = {
        public: {
            icon: <PublicIcon className="text-[14px]" />,
            className: "bg-emerald-100 text-emerald-700"
        },
        private: {
            icon: <LockIcon className="text-[14px]" />,
            className: "bg-slate-100 text-slate-600"
        },
        team: {
            icon: <GroupIcon className="text-[14px]" />,
            className: "bg-blue-100 text-blue-700"
        }
    };

    const { icon, className } = config[visibility];

    return (
        <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 ${className}`}>
            {icon}
            {visibility}
        </div>
    );
}
