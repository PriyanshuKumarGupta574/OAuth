import {
    Typography,
    Button,
} from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { getUserAnalytics } from "../services/analytics.service";
import type { UserStats } from "../types";

export default function Profile() {
    // Decode token or fetch user details. For now, using mock or minimal data
    // In a real app, you'd have a /auth/me endpoint.
    // Assuming we might need to add that, but for now let's display what we can or generic info.

    const [stats, setStats] = useState<UserStats | null>(null);

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
            <div className="max-w-[800px] mx-auto mt-10 p-4 pb-20">
                <Typography variant="h4" className="font-extrabold text-slate-800 mb-10">
                    My Profile
                </Typography>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-12">
                    <div className="p-10">
                        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                            <div className="w-32 h-32 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-5xl font-extrabold shadow-lg shadow-indigo-200 border-4 border-white">
                                {user.name[0]}
                            </div>
                            <div className="text-center md:text-left space-y-2">
                                <Typography variant="h4" className="font-extrabold text-slate-800">
                                    {user.name}
                                </Typography>
                                <Typography className="text-slate-500 font-medium text-lg">
                                    {user.email}
                                </Typography>
                                <div className="pt-2">
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case px-6 py-2 rounded-xl"
                                    >
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-50">
                            <Typography variant="h6" className="font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-[#1a73e8] rounded-full"></span>
                                Personal Details
                            </Typography>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <div className="p-3 bg-white rounded-xl text-slate-400 shadow-sm">
                                        <PersonIcon />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Full Name</div>
                                        <div className="text-slate-700 font-bold">{user.name}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <div className="p-3 bg-white rounded-xl text-slate-400 shadow-sm">
                                        <EmailIcon />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Email Address</div>
                                        <div className="text-slate-700 font-bold">{user.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <div className="p-3 bg-white rounded-xl text-slate-400 shadow-sm">
                                        <CalendarTodayIcon />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Joined Date</div>
                                        <div className="text-slate-700 font-bold">{user.joinDate}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Overview */}
                <div className="space-y-6">
                    <Typography variant="h6" className="font-extrabold text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                        Activity Overview
                    </Typography>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2 hover:shadow-md transition-shadow">
                            <div className="text-4xl font-black text-indigo-600">{stats?.totalSnippets || 0}</div>
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-[2px]">Snippets</div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2 hover:shadow-md transition-shadow">
                            <div className="text-4xl font-black text-purple-600">{stats?.totalViews || 0}</div>
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-[2px]">Views</div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2 hover:shadow-md transition-shadow">
                            <div className="text-4xl font-black text-emerald-600">{stats?.totalForks || 0}</div>
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-[2px]">Forks</div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
