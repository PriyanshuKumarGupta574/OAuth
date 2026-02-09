import { useState } from "react";
import { Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router";
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
            <div className="max-w-[600px] mx-auto mt-10 p-6 bg-white rounded-2xl border border-slate-200 shadow-xl">
                <Typography variant="h4" className="font-extrabold text-slate-800 mb-8">
                    Create New Team
                </Typography>

                {error && (
                    <Alert
                        severity="error"
                        className="mb-6 rounded-xl border border-red-100 bg-red-50 text-red-700 font-medium"
                    >
                        {error}
                    </Alert>
                )}

                <div className="flex flex-col gap-6">
                    <TextField
                        label="Team Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="[&_.MuiOutlinedInput-root]:rounded-xl"
                    />

                    <TextField
                        label="Description (Optional)"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What is this team about?"
                        className="[&_.MuiOutlinedInput-root]:rounded-xl"
                    />

                    <div className="flex gap-4 mt-4">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleCreate}
                            className="flex-1 bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case py-3.5 rounded-xl text-lg"
                        >
                            Create Team
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate("/dashboard/teams")}
                            className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case py-3.5 rounded-xl text-lg"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
