import {
    Box,
    Typography,
    Card,
    Switch,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
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
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
                <Typography variant="h4" fontWeight={700} mb={4}>
                    Settings
                </Typography>

                <Card sx={{ mb: 4 }}>
                    <Box p={3}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Appearance
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Customize how the application looks on your device.
                        </Typography>
                    </Box>
                    <Divider />
                    <List>
                        <ListItem>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <DarkModeIcon color="action" />
                                <ListItemText
                                    primary="Dark Mode"
                                    secondary="Switch between light and dark themes"
                                />
                            </Box>
                            <ListItemSecondaryAction>
                                <Switch edge="end" />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Card>

                <Card sx={{ mb: 4 }}>
                    <Box p={3}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Notifications
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Manage your email and push notification preferences.
                        </Typography>
                    </Box>
                    <Divider />
                    <List>
                        <ListItem>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <NotificationsIcon color="action" />
                                <ListItemText
                                    primary="Email Notifications"
                                    secondary="Receive emails about activity on your snippets"
                                />
                            </Box>
                            <ListItemSecondaryAction>
                                <Switch edge="end" defaultChecked />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Card>

                <Card sx={{ mb: 4 }}>
                    <Box p={3}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Security
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Update your password and secure your account.
                        </Typography>
                    </Box>
                    <Divider />
                    <Box p={3}>
                        <Button variant="outlined" startIcon={<LockIcon />}>
                            Change Password
                        </Button>
                    </Box>
                </Card>

                <Card sx={{ borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
                    <Box p={3}>
                        <Typography variant="h6" fontWeight={600} gutterBottom color="error">
                            Danger Zone
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Once you delete your account, there is no going back. Please be certain.
                        </Typography>
                        <Button variant="contained" color="error" startIcon={<DeleteIcon />}>
                            Delete Account
                        </Button>
                    </Box>
                </Card>

            </Box>
        </DashboardLayout>
    );
}
