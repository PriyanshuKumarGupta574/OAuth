import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import { useNavigate } from "react-router";
import { getUserAnalytics } from "../services/analytics.service";
import type { UserStats } from "../types";
import CodeIcon from "@mui/icons-material/Code";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserAnalytics()
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const StatCard = ({ title, value, icon, color, bgColor }: {
    title: string;
    value: number | undefined;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="space-y-1">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</div>
        <div className="text-4xl font-black text-slate-800">{value || 0}</div>
      </div>
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 mt-10 pb-20">
        {/* Welcome Section */}
        <div className="mb-12">
          <Typography variant="h3" className="font-black mb-3 text-slate-800 tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Developer</span>
          </Typography>
          <Typography className="text-slate-500 text-lg font-medium">
            Here's what's happening with your snippets and teams today.
          </Typography>
        </div>

        {loading ? (
          <div className="flex justify-center my-20">
            <CircularProgress thickness={5} size={60} className="text-[#1a73e8]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <StatCard
              title="Snippets"
              value={stats?.totalSnippets}
              icon={<CodeIcon className="text-3xl" />}
              color="#4f46e5"
              bgColor="#eef2ff"
            />
            <StatCard
              title="Views"
              value={stats?.totalViews}
              icon={<VisibilityIcon className="text-3xl" />}
              color="#10b981"
              bgColor="#ecfdf5"
            />
            <StatCard
              title="Forks"
              value={stats?.totalForks}
              icon={<ForkRightIcon className="text-3xl" />}
              color="#f59e0b"
              bgColor="#fffbeb"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-8">
          <Typography variant="h5" className="font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#1a73e8] rounded-full"></span>
            Quick Actions
          </Typography>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div
              className="group p-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] text-white relative overflow-hidden cursor-pointer shadow-xl shadow-indigo-100 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              onClick={() => navigate("/dashboard/snippets/create")}
            >
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <Typography variant="h4" className="font-black tracking-tight leading-tight">
                    Create New<br />Snippet
                  </Typography>
                  <Typography className="text-indigo-100 font-medium text-lg leading-relaxed max-w-[340px]">
                    Share your knowledge with the world or keep it private.
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  className="bg-white text-indigo-600 hover:bg-slate-50 shadow-none py-3 px-8 rounded-2xl font-black normal-case text-lg group-hover:scale-105 transition-transform"
                  startIcon={<AddIcon />}
                >
                  Create Now
                </Button>
              </div>
              <CodeIcon className="absolute -right-8 -bottom-8 text-[240px] opacity-10 text-white group-hover:rotate-12 transition-transform duration-700" />
            </div>

            <div
              className="p-10 h-full bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col justify-center items-start cursor-pointer hover:border-[#1a73e8] hover:bg-blue-50/50 transition-all duration-300 group"
              onClick={() => navigate("/dashboard/snippets")}
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <Typography variant="h4" className="font-black text-slate-800 tracking-tight leading-tight group-hover:text-[#1a73e8] transition-colors">
                    Manage<br />Collection
                  </Typography>
                  <Typography className="text-slate-500 font-medium text-lg leading-relaxed max-w-[340px]">
                    View, organize, and edit your code snippets collection.
                  </Typography>
                </div>
                <Button
                  variant="outlined"
                  startIcon={<FormatListBulletedIcon />}
                  className="border-slate-200 text-slate-600 group-hover:border-[#1a73e8] group-hover:text-[#1a73e8] group-hover:bg-white shadow-none font-black normal-case px-8 py-3 rounded-2xl text-lg transition-all"
                >
                  View Library
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
