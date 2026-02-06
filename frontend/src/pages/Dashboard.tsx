import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { getUserAnalytics } from "../services/analytics.service";
import CodeIcon from "@mui/icons-material/Code";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserAnalytics()
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const StatCard = ({ title, value, icon, color, bgColor }: any) => (
    <Card
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight={600} mb={0.5}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          {value || 0}
        </Typography>
      </Box>
      <Box
        sx={{
          bgcolor: bgColor,
          p: 1.5,
          borderRadius: "12px",
          color: color,
          display: "flex",
        }}
      >
        {icon}
      </Box>
    </Card>
  );

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Box mb={5}>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ background: "linear-gradient(45deg, #4f46e5, #9333ea)", backgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>
            Welcome to your Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Here's what's happening with your snippets today.
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} mb={5}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                title="Total Snippets"
                value={stats?.totalSnippets}
                icon={<CodeIcon sx={{ fontSize: 28 }} />}
                color="#4f46e5" // Indigo
                bgColor="#e0e7ff"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                title="Total Views"
                value={stats?.totalViews}
                icon={<VisibilityIcon sx={{ fontSize: 28 }} />}
                color="#10b981" // Emerald
                bgColor="#d1fae5"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                title="Total Forks"
                value={stats?.totalForks}
                icon={<ForkRightIcon sx={{ fontSize: 28 }} />}
                color="#f59e0b" // Amber
                bgColor="#fef3c7"
              />
            </Grid>
          </Grid>
        )}

        {/* Quick Actions */}
        <Typography variant="h6" fontWeight={700} mb={3}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: "primary.main",
                color: "white",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.01)" },
              }}
              onClick={() => navigate("/dashboard/snippets/create")}
            >
              <Box position="relative" zIndex={1}>
                <Typography variant="h5" fontWeight={700} mb={1}>
                  Create New Snippet
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                  Start coding and share your knowledge with the team.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                  startIcon={<AddIcon />}
                >
                  Create Now
                </Button>
              </Box>
              <CodeIcon
                sx={{
                  position: "absolute",
                  right: -20,
                  bottom: -20,
                  fontSize: 180,
                  opacity: 0.1,
                  color: "white",
                }}
              />
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                height: "100%",
                border: "1px dashed #cbd5e1",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                cursor: "pointer",
                "&:hover": { borderColor: "primary.main", bgcolor: "#f8fafc" },
              }}
              onClick={() => navigate("/dashboard/snippets")}
            >
              <Typography variant="h6" fontWeight={700} mb={1} color="text.primary">
                Manage Snippets
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                View, edit, and organize your existing code collection.
              </Typography>
              <Button variant="outlined" startIcon={<FormatListBulletedIcon />}>
                View All
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}



