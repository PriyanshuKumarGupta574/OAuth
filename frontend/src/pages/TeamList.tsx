import { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import DashboardLayout from "../layout/DashboardLayout";
import { getMyTeams } from "../services/team.service";
import type { Team } from "../types";

export default function TeamList() {
    const [teams, setTeams] = useState<Team[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getMyTeams().then((res) => setTeams(res.data));
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-[900px] mx-auto mt-8 p-4">
                <div className="flex justify-between items-center mb-10">
                    <Typography variant="h4" className="font-extrabold text-slate-800">My Teams</Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/dashboard/teams/create")}
                        className="bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case px-6 py-2.5 rounded-xl"
                    >
                        + New Team
                    </Button>
                </div>

                {teams.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <Typography className="text-slate-500 font-medium italic">You are not part of any teams yet.</Typography>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {teams.map((team) => (
                            <div
                                key={team._id}
                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                                onClick={() => navigate(`/dashboard/teams/${team._id}`)}
                            >
                                <Typography variant="h6" className="font-bold mb-2 group-hover:text-[#1a73e8] transition-colors">
                                    {team.name}
                                </Typography>
                                <Typography variant="body2" className="text-slate-500 mb-6 line-clamp-2 min-h-[40px]">
                                    {team.description || "No description provided"}
                                </Typography>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${(typeof team.owner === 'string' ? team.owner : team.owner._id) === 'current_user_id' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                        {(typeof team.owner === 'string' ? team.owner : team.owner._id) === 'current_user_id' ? "Owner" : "Member"}
                                    </span>
                                    <Typography variant="caption" className="text-slate-400 font-medium">
                                        {team.members?.length || 0} members
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
