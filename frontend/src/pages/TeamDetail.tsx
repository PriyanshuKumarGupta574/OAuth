import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    Typography,
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
import type { Team, Snippet, TeamMember } from "../types";
import { AxiosError } from "axios";

export default function TeamDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [team, setTeam] = useState<Team | null>(null);
    const [snippets, setSnippets] = useState<Snippet[]>([]);
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
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError(axiosError.response?.data?.message || "Failed to add member");
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

    const ownerName = typeof team.owner === 'object' ? team.owner.name : 'Owner';
    const ownerEmail = typeof team.owner === 'object' ? team.owner.email : '';

    return (
        <DashboardLayout>
            <div className="max-w-[900px] mx-auto mt-8 p-4">
                <div className="flex justify-between items-center mb-6">
                    <Typography variant="h4" className="font-extrabold text-slate-800">
                        {team.name}
                    </Typography>
                    <Button
                        color="error"
                        variant="outlined"
                        onClick={handleLeaveTeam}
                        className="normal-case font-bold border-red-200 text-red-600 hover:bg-red-50"
                    >
                        Leave Team
                    </Button>
                </div>

                <Typography className="text-slate-500 mb-10 leading-relaxed text-lg">
                    {team.description}
                </Typography>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <Typography variant="h6" className="font-bold text-slate-800">Members</Typography>
                        <Button
                            startIcon={<PersonAddIcon />}
                            onClick={() => setOpenInvite(true)}
                            className="bg-slate-50 text-slate-700 hover:bg-slate-100 normal-case font-bold px-4 py-2 rounded-xl border border-slate-200"
                        >
                            Add Member
                        </Button>
                    </div>
                    <Divider className="mb-4" />
                    <List className="divide-y divide-slate-50">
                        <ListItem className="py-4">
                            <ListItemText
                                primary={<span className="font-bold text-slate-800">{ownerName} (Owner)</span>}
                                secondary={ownerEmail}
                                primaryTypographyProps={{ className: "text-slate-800" }}
                                secondaryTypographyProps={{ className: "text-slate-500 uppercase text-[10px] font-bold tracking-widest mt-1" }}
                            />
                        </ListItem>
                        {team.members.map((member: TeamMember) => (
                            <ListItem key={member.user._id} className="py-4">
                                <ListItemText
                                    primary={<span className="font-bold text-slate-800">{member.user.name}</span>}
                                    secondary={`${member.user.email} - ${member.role}`}
                                    primaryTypographyProps={{ className: "text-slate-800" }}
                                    secondaryTypographyProps={{ className: "text-slate-500 uppercase text-[10px] font-bold tracking-widest mt-1" }}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => handleRemoveMember(member.user._id)} className="text-red-400 hover:text-red-600 bg-red-50/0 hover:bg-red-50 transition-colors">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <Typography variant="h6" className="font-bold text-slate-800 mb-6">
                        Team Snippets
                    </Typography>
                    <Divider className="mb-4" />
                    {snippets.length === 0 ? (
                        <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <Typography className="text-slate-400 italic">No snippets in this team yet.</Typography>
                        </div>
                    ) : (
                        <List className="space-y-2">
                            {snippets.map((snippet) => (
                                <ListItemButton
                                    key={snippet._id}
                                    onClick={() => navigate(`/dashboard/snippets/${snippet._id}`)}
                                    className="rounded-xl border border-slate-50 hover:border-[#1a73e8] hover:bg-blue-50/30 transition-all p-4"
                                >
                                    <ListItemText
                                        primary={<span className="font-bold text-slate-800">{snippet.title}</span>}
                                        secondary={
                                            <div className="flex items-center gap-2 mt-2">
                                                <Chip
                                                    label={snippet.language}
                                                    size="small"
                                                    className="bg-slate-100 text-slate-600 border-none font-mono text-[10px]"
                                                />
                                                <span className="text-slate-400 text-xs">
                                                    {new Date(snippet.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    )}
                </div>

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
            </div>
        </DashboardLayout>
    );
}
