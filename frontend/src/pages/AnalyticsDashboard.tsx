import { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    Grid,
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
                <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                    <CircularProgress />
                </Box>
            </DashboardLayout>
        );
    }

    if (!analytics) {
        return (
            <DashboardLayout>
                <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 3 }}>
                    <Typography color="error">Failed to load analytics</Typography>
                </Box>
            </DashboardLayout>
        );
    }

    const statCards = [
        {
            title: "Total Snippets",
            value: analytics.totalSnippets,
            icon: <CodeIcon sx={{ fontSize: 40, color: "primary.main" }} />,
            color: "#1976d2",
        },
        {
            title: "Total Views",
            value: analytics.totalViews,
            icon: <VisibilityIcon sx={{ fontSize: 40, color: "success.main" }} />,
            color: "#2e7d32",
        },
        {
            title: "Total Forks",
            value: analytics.totalForks,
            icon: <ForkRightIcon sx={{ fontSize: 40, color: "warning.main" }} />,
            color: "#ed6c02",
        },
        {
            title: "Total Comments",
            value: analytics.totalComments,
            icon: <CommentIcon sx={{ fontSize: 40, color: "info.main" }} />,
            color: "#0288d1",
        },
    ];

    return (
        <DashboardLayout>
            <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 3 }}>
                <Typography variant="h4" fontWeight="bold" mb={4}>
                    📊 Your Analytics Dashboard
                </Typography>

                {/* Stats Grid */}
                <Grid container spacing={3} mb={4}>
                    {statCards.map((stat) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.title}>
                            <Card
                                sx={{
                                    p: 3,
                                    textAlign: "center",
                                    transition: "all 0.3s",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                {stat.icon}
                                <Typography variant="h4" fontWeight="bold" mt={2}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mt={1}>
                                    {stat.title}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Most Viewed Snippet */}
                {analytics.mostViewed && (
                    <Card sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight="bold" mb={3}>
                            🏆 Most Viewed Snippet
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="h6">{analytics.mostViewed.title}</Typography>
                                <Typography variant="body2" color="text.secondary" mt={1}>
                                    This snippet has been viewed the most
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    bgcolor: "primary.light",
                                    px: 3,
                                    py: 2,
                                    borderRadius: 2,
                                }}
                            >
                                <VisibilityIcon />
                                <Typography variant="h5" fontWeight="bold">
                                    {analytics.mostViewed.views}
                                </Typography>
                                <Typography variant="body2">views</Typography>
                            </Box>
                        </Box>
                    </Card>
                )}

                {analytics.totalSnippets === 0 && (
                    <Card sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h6" color="text.secondary">
                            You haven't created any snippets yet.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            Start creating snippets to see your analytics!
                        </Typography>
                    </Card>
                )}
            </Box>
        </DashboardLayout>
    );
}
