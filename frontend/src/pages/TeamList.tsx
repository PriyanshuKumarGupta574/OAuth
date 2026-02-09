import { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import DashboardLayout from "../layout/DashboardLayout";
import { getMyTeams } from "../services/team.service";

export default function TeamList() {
    const [teams, setTeams] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getMyTeams().then((res) => setTeams(res.data));
    }, []);

    return (
        <DashboardLayout>
            <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                    <Typography variant="h4" fontWeight="bold">My Teams</Typography>
                    <Button variant="contained" onClick={() => navigate("/dashboard/teams/create")}>
                        + New Team
                    </Button>
                </Box>

                {teams.length === 0 ? (
                    <Typography color="text.secondary">You are not part of any teams yet.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {teams.map((team) => (
                            <Grid xs={12} md={6} key={team._id}>
                                <Card
                                    sx={{ cursor: "pointer", "&:hover": { boxShadow: 4 } }}
                                    onClick={() => navigate(`/dashboard/teams/${team._id}`)}
                                >
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold">
                                            {team.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {team.description || "No description"}
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            Permission: {team.owner._id === team.owner ? "Owner" : "Member"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </DashboardLayout>
    );
}
