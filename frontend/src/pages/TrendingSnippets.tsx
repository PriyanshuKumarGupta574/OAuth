import { useEffect, useState } from "react";
import {
    Typography,
    Chip,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router";
import DashboardLayout from "../layout/DashboardLayout";
import { getTrendingSnippets } from "../services/analytics.service";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import CommentIcon from "@mui/icons-material/Comment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

type TrendingSnippet = {
    _id: string;
    title: string;
    language: string;
    tags: string[];
    views: number;
    forks: number;
    commentCount: number;
    trendingScore: number;
    author: {
        name: string;
        email: string;
    };
    createdAt: string;
};

export default function TrendingSnippets() {
    const [snippets, setSnippets] = useState<TrendingSnippet[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getTrendingSnippets(20)
            .then((res) => {
                setSnippets(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load trending snippets:", err);
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

    return (
        <DashboardLayout>
            <div className="max-w-[1200px] mx-auto mt-8 p-6">
                <div className="flex items-center gap-4 mb-10">
                    <TrendingUpIcon className="text-4xl text-[#1a73e8]" />
                    <Typography variant="h4" className="font-extrabold text-slate-800">
                        Trending Snippets 🔥
                    </Typography>
                </div>

                {snippets.length === 0 ? (
                    <Typography className="text-slate-500 text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        No trending snippets yet. Be the first to create one!
                    </Typography>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {snippets.map((snippet, index) => (
                            <div
                                key={snippet._id}
                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative group"
                                onClick={() => navigate(`/dashboard/snippets/${snippet._id}`)}
                            >
                               
                                {index < 3 && (
                                    <div
                                        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${index === 0
                                            ? "bg-amber-400"
                                            : index === 1
                                                ? "bg-slate-400"
                                                : "bg-amber-700"
                                            }`}
                                    >
                                        #{index + 1}
                                    </div>
                                )}

                                <Typography variant="h6" className="font-bold mb-2 group-hover:text-[#1a73e8] transition-colors">
                                    {snippet.title}
                                </Typography>

                                <Typography variant="body2" className="text-slate-500 mb-4">
                                    by <span className="font-semibold text-slate-700">{snippet.author.name}</span> • <span className="font-mono text-xs">{snippet.language}</span>
                                </Typography>

                               
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {snippet.tags.slice(0, 3).map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            className="bg-slate-100 text-slate-600 border-none font-medium"
                                        />
                                    ))}
                                </div>

                               
                                <div className="flex gap-6 items-center flex-wrap pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <VisibilityIcon className="text-sm" />
                                        <Typography variant="body2" className="font-medium">{snippet.views}</Typography>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <ForkRightIcon className="text-sm" />
                                        <Typography variant="body2" className="font-medium">{snippet.forks}</Typography>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <CommentIcon className="text-sm" />
                                        <Typography variant="body2" className="font-medium">
                                            {snippet.commentCount}
                                        </Typography>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[#1a73e8] ml-auto">
                                        <TrendingUpIcon className="text-sm" />
                                        <Typography variant="body2" className="font-bold">
                                            {snippet.trendingScore.toFixed(2)}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
