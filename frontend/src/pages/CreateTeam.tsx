import { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { createTeam } from "../services/team.service";

export default function CreateTeam() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        try {
            if (!name) return setError("Team name is required");
            await createTeam(name, description);
            navigate("/dashboard/teams");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create team");
        }
    };

    return (
        <DashboardLayout>
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
                <Typography variant="h4" fontWeight="bold" mb={3}>
                    Create New Team
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField
                    label="Team Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Description (Optional)"
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <Button variant="contained" size="large" onClick={handleCreate}>
                    Create Team
                </Button>
            </Box>
        </DashboardLayout>
    );
}
