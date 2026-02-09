import {
    Typography,
    Switch,
    Button,
} from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Settings() {
    return (
        <DashboardLayout>
            <div className="max-w-[800px] mx-auto mt-10 p-4 pb-20">
                <Typography variant="h4" className="font-extrabold text-slate-800 mb-10">
                    Settings
                </Typography>

                
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                    <div className="p-8 border-b border-slate-50">
                        <Typography variant="h6" className="font-extrabold text-slate-800 mb-1">
                            Appearance
                        </Typography>
                        <Typography className="text-slate-500 text-sm font-medium">
                            Customize how the application looks on your device.
                        </Typography>
                    </div>
                    <div className="p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                                    <DarkModeIcon />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-slate-700 font-bold">Dark Mode</div>
                                    <div className="text-slate-400 text-xs font-medium leading-relaxed max-w-[240px]">
                                        Switch between light and dark themes for better comfort.
                                    </div>
                                </div>
                            </div>
                            <Switch color="primary" />
                        </div>
                    </div>
                </div>

               
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                    <div className="p-8 border-b border-slate-50">
                        <Typography variant="h6" className="font-extrabold text-slate-800 mb-1">
                            Notifications
                        </Typography>
                        <Typography className="text-slate-500 text-sm font-medium">
                            Manage your email and push notification preferences.
                        </Typography>
                    </div>
                    <div className="p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl text-[#1a73e8]">
                                    <NotificationsIcon />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-slate-700 font-bold">Email Notifications</div>
                                    <div className="text-slate-400 text-xs font-medium leading-relaxed max-w-[240px]">
                                        Receive emails about activity on your snippets and teams.
                                    </div>
                                </div>
                            </div>
                            <Switch color="primary" defaultChecked />
                        </div>
                    </div>
                </div>

                
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                    <div className="p-8 border-b border-slate-50">
                        <Typography variant="h6" className="font-extrabold text-slate-800 mb-1">
                            Security
                        </Typography>
                        <Typography className="text-slate-500 text-sm font-medium">
                            Update your password and secure your account.
                        </Typography>
                    </div>
                    <div className="p-8">
                        <Button
                            variant="outlined"
                            startIcon={<LockIcon />}
                            className="border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case px-8 py-3 rounded-xl"
                        >
                            Change Password
                        </Button>
                    </div>
                </div>

             
                <div className="bg-white rounded-3xl border-2 border-red-100 shadow-sm overflow-hidden">
                    <div className="p-8 bg-red-50/30 border-b border-red-50">
                        <Typography variant="h6" className="font-extrabold text-red-600 mb-1">
                            Danger Zone
                        </Typography>
                        <Typography className="text-slate-500 text-sm font-medium">
                            Irreversible actions for your account.
                        </Typography>
                    </div>
                    <div className="p-8">
                        <Typography className="text-slate-600 text-sm mb-6 font-medium leading-relaxed max-w-[400px]">
                            Once you delete your account, all your snippets, folders, and team data will be permanently removed. There is no going back.
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            className="bg-red-500 hover:bg-red-600 shadow-none font-bold normal-case px-8 py-3 rounded-xl"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
