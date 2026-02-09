import { useEffect, useState } from "react";
import {
    Typography,
    CircularProgress,
} from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import { getUserAnalytics } from "../services/analytics.service";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import CommentIcon from "@mui/icons-material/Comment";
import CodeIcon from "@mui/icons-material/Code";

type Analytics = {
    totalSnippets: number;
    totalViews: number;
    totalForks: number;
    totalComments: number;
    mostViewed: {
        id: string;
        title: string;
        views: number;
    } | null;
};

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserAnalytics()
            .then((res) => {
                setAnalytics(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load analytics:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center mt-20">
                    <CircularProgress />
                </div>
            </DashboardLayout>
        );
    }

    if (!analytics) {
        return (
            <DashboardLayout>
                <div className="max-w-[1200px] mx-auto mt-10 p-6">
                    <Typography className="text-red-500 font-bold text-center py-20 bg-red-50 rounded-2xl border border-red-100">
                        Failed to load analytics
                    </Typography>
                </div>
            </DashboardLayout>
        );
    }

    const statCards = [
        {
            title: "Total Snippets",
            value: analytics.totalSnippets,
            icon: <CodeIcon className="text-4xl text-[#1a73e8]" />,
            gradient: "from-blue-50 to-white",
            border: "border-blue-100",
        },
        {
            title: "Total Views",
            value: analytics.totalViews,
            icon: <VisibilityIcon className="text-4xl text-emerald-500" />,
            gradient: "from-emerald-50 to-white",
            border: "border-emerald-100",
        },
        {
            title: "Total Forks",
            value: analytics.totalForks,
            icon: <ForkRightIcon className="text-4xl text-amber-500" />,
            gradient: "from-amber-50 to-white",
            border: "border-amber-100",
        },
        {
            title: "Total Comments",
            value: analytics.totalComments,
            icon: <CommentIcon className="text-4xl text-cyan-500" />,
            gradient: "from-cyan-50 to-white",
            border: "border-cyan-100",
        },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-[1200px] mx-auto mt-8 p-6">
                <Typography variant="h4" className="font-extrabold text-slate-800 mb-10">
                    Your Analytics Dashboard
                </Typography>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {statCards.map((stat) => (
                        <div
                            key={stat.title}
                            className={`p-8 rounded-3xl bg-gradient-to-br ${stat.gradient} border ${stat.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group`}
                        >
                            <div className="mb-4 p-4 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <Typography variant="h3" className="font-extrabold text-slate-800 tracking-tight">
                                {stat.value}
                            </Typography>
                            <Typography variant="body2" className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
                                {stat.title}
                            </Typography>
                        </div>
                    ))}
                </div>

                {/* Most Viewed Snippet */}
                {analytics.mostViewed && (
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

                        <Typography variant="h5" className="font-extrabold text-slate-800 mb-8 flex items-center gap-2">
                            🏆 Most Viewed Snippet
                        </Typography>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div>
                                <Typography variant="h5" className="font-bold text-slate-800 group-hover:text-[#1a73e8] transition-colors">
                                    {analytics.mostViewed.title}
                                </Typography>
                                <Typography variant="body1" className="text-slate-500 mt-2">
                                    This snippet is gaining the most attention from your audience.
                                </Typography>
                            </div>
                            <div className="flex items-center gap-4 bg-blue-50 text-[#1a73e8] px-8 py-5 rounded-2xl border border-blue-100 shadow-inner">
                                <VisibilityIcon className="text-2xl" />
                                <div className="flex flex-col">
                                    <span className="text-3xl font-extrabold leading-tight">
                                        {analytics.mostViewed.views}
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                                        views
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {analytics.totalSnippets === 0 && (
                    <div className="bg-slate-50 p-12 rounded-3xl border border-dashed border-slate-300 text-center">
                        <Typography variant="h6" className="text-slate-800 font-bold mb-2">
                            You haven't created any snippets yet.
                        </Typography>
                        <Typography className="text-slate-500">
                            Start creating snippets to see your analytics dashboard come to life!
                        </Typography>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
