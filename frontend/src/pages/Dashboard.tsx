import { Card, Typography } from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Card sx={{ p: 4, borderRadius: "16px" }}>
        <Typography variant="h4">Welcome to Dashboard 🎉</Typography>
        <Typography mt={2}>
          You have successfully logged in.
        </Typography>
      </Card>
    </DashboardLayout>
  );
}
