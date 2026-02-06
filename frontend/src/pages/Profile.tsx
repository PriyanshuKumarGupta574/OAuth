import {
    Box,
    Typography,
    Card,
    Avatar,
    Grid,
    Divider,
    Button,
} from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { getUserAnalytics } from "../services/analytics.service";

export default function Profile() {
    // Decode token or fetch user details. For now, using mock or minimal data
    // In a real app, you'd have a /auth/me endpoint.
    // Assuming we might need to add that, but for now let's display what we can or generic info.

    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        getUserAnalytics().then((res) => setStats(res.data)).catch(console.error);
    }, []);

    // Mock user data since we don't have a direct /me endpoint in the context yet
    // We would typically verify the token and get user info.
    // For the UI demonstration:
    const user = {
        name: "User", // This would ideally come from the backend
        email: "user@example.com", // This would ideally come from the backend
        joinDate: "January 2026",
    };

    return (
        <DashboardLayout>
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
                <Typography variant="h4" fontWeight={700} mb={4}>
                    My Profile
                </Typography>

                <Card sx={{ p: 4, mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
                        <Avatar
                            sx={{ width: 100, height: 100, bgcolor: "primary.main", fontSize: 40 }}
                        >
                            {user.name[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight={600}>
                                {user.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {user.email}
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                size="small"
                                sx={{ mt: 2 }}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Details
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
                                <PersonIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Full Name</Typography>
                                    <Typography variant="body1" fontWeight={500}>{user.name}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
                                <EmailIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Email Address</Typography>
                                    <Typography variant="body1" fontWeight={500}>{user.email}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
                                <CalendarTodayIcon color="action" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Joined</Typography>
                                    <Typography variant="body1" fontWeight={500}>{user.joinDate}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>

                {/* Quick Stats in Profile */}
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Activity Overview
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                        <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                            <Typography variant="h4" fontWeight={700}>{stats?.totalSnippets || 0}</Typography>
                            <Typography variant="body2">Snippets</Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                            <Typography variant="h4" fontWeight={700}>{stats?.totalViews || 0}</Typography>
                            <Typography variant="body2">Views</Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                            <Typography variant="h4" fontWeight={700}>{stats?.totalForks || 0}</Typography>
                            <Typography variant="body2">Forks</Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </DashboardLayout>
    );
}
