import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    Box,
    Typography,
    Paper,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DashboardLayout from "../layout/DashboardLayout";
import {
    getTeamById,
    addMember,
    removeMember,
    leaveTeam,
} from "../services/team.service";
import { getSnippets } from "../services/snippet.service";

export default function TeamDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState<any>(null);
    const [snippets, setSnippets] = useState<any[]>([]);
    const [openInvite, setOpenInvite] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const fetchTeam = async () => {
        try {
            const res = await getTeamById(id!);
            setTeam(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSnippets = async () => {
        try {
            // Fetch snippets for this team
            const res = await getSnippets(undefined, undefined, 1, undefined, undefined, undefined, undefined, id);
            setSnippets(res.data.snippets);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTeam();
            fetchSnippets();
        }
    }, [id]);

    const handleAddMember = async () => {
        try {
            await addMember(id!, email, "viewer");
            setOpenInvite(false);
            setEmail("");
            fetchTeam();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add member");
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            await removeMember(id!, memberId);
            fetchTeam();
        }
    };

    const handleLeaveTeam = async () => {
        if (window.confirm("Are you sure you want to leave this team?")) {
            await leaveTeam(id!);
            navigate("/dashboard/teams");
        }
    };

    if (!team) return <Typography>Loading...</Typography>;

    return (
        <DashboardLayout>
            <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h4" fontWeight="bold">
                        {team.name}
                    </Typography>
                    <Button color="error" variant="outlined" onClick={handleLeaveTeam}>
                        Leave Team
                    </Button>
                </Box>

                <Typography color="text.secondary" mb={4}>
                    {team.description}
                </Typography>

                <Paper sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="h6">Members</Typography>
                        <Button
                            startIcon={<PersonAddIcon />}
                            onClick={() => setOpenInvite(true)}
                        >
                            Add Member
                        </Button>
                    </Box>
                    <Divider />
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={`${team.owner.name} (Owner)`}
                                secondary={team.owner.email}
                            />
                        </ListItem>
                        {team.members.map((member: any) => (
                            <ListItem key={member.user._id}>
                                <ListItemText
                                    primary={member.user.name}
                                    secondary={`${member.user.email} - ${member.role}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => handleRemoveMember(member.user._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" mb={2}>
                        Team Snippets
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {snippets.length === 0 ? (
                        <Typography color="text.secondary">No snippets in this team yet.</Typography>
                    ) : (
                        <List>
                            {snippets.map((snippet) => (
                                <ListItemButton
                                    key={snippet._id}
                                    onClick={() => navigate(`/dashboard/snippets/${snippet._id}`)}
                                >
                                    <ListItemText
                                        primary={snippet.title}
                                        secondary={
                                            <>
                                                <Chip
                                                    label={snippet.language}
                                                    size="small"
                                                    sx={{ mr: 1 }}
                                                />
                                                {new Date(snippet.createdAt).toLocaleDateString()}
                                            </>
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    )}
                </Paper>

                <Dialog open={openInvite} onClose={() => setOpenInvite(false)}>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogContent>
                        {error && <Typography color="error" mb={2}>{error}</Typography>}
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Email Address"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenInvite(false)}>Cancel</Button>
                        <Button onClick={handleAddMember} variant="contained">
                            Invite
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </DashboardLayout>
    );
}
