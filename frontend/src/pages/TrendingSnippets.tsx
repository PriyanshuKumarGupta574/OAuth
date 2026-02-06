import { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    Grid,
    Chip,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
                <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                    <CircularProgress />
                </Box>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: "primary.main" }} />
                    <Typography variant="h4" fontWeight="bold">
                        Trending Snippets 🔥
                    </Typography>
                </Box>

                {snippets.length === 0 ? (
                    <Typography color="text.secondary">
                        No trending snippets yet. Be the first to create one!
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {snippets.map((snippet, index) => (
                            <Grid item xs={12} md={6} key={snippet._id}>
                                <Card
                                    sx={{
                                        p: 3,
                                        cursor: "pointer",
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: 6,
                                        },
                                        position: "relative",
                                    }}
                                    onClick={() => navigate(`/dashboard/snippets/${snippet._id}`)}
                                >
                                    {/* Trending Rank Badge */}
                                    {index < 3 && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 10,
                                                right: 10,
                                                bgcolor:
                                                    index === 0
                                                        ? "gold"
                                                        : index === 1
                                                            ? "silver"
                                                            : "#cd7f32",
                                                color: "white",
                                                borderRadius: "50%",
                                                width: 32,
                                                height: 32,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            #{index + 1}
                                        </Box>
                                    )}

                                    <Typography variant="h6" fontWeight="bold" mb={1}>
                                        {snippet.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        by {snippet.author.name} • {snippet.language}
                                    </Typography>

                                    {/* Tags */}
                                    <Box sx={{ mb: 2 }}>
                                        {snippet.tags.slice(0, 3).map((tag) => (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                size="small"
                                                sx={{ mr: 1, mb: 1 }}
                                            />
                                        ))}
                                    </Box>

                                    {/* Stats */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 3,
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <VisibilityIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{snippet.views}</Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <ForkRightIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{snippet.forks}</Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <CommentIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {snippet.commentCount}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <TrendingUpIcon fontSize="small" color="primary" />
                                            <Typography variant="body2" color="primary.main" fontWeight="bold">
                                                {snippet.trendingScore.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </DashboardLayout>
    );
}
