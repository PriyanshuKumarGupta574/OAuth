import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CircularProgress, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();


  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/");
      return;
    }

    login(token);
    navigate("/dashboard", { replace: true });
  }, [params, navigate, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)] p-6">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <CircularProgress size={80} thickness={4} className="text-[#1a73e8]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-blue-50 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-center space-y-2">
          <Typography variant="h5" className="font-black text-slate-800 tracking-tight">
            Authenticating...
          </Typography>
          <Typography className="text-slate-500 font-medium">
            Setting up your secure workspace
          </Typography>
        </div>
      </div>
    </div>
  );
}
