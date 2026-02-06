import { Card, Typography, Button, Stack } from "@mui/material";
import DashboardLayout from "../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Card sx={{ p: 4, borderRadius: "16px" }}>
        <Typography variant="h4">Welcome to Dashboard 🎉</Typography>
        <Typography mt={2}>
          You have successfully logged in.
        </Typography>

        
        <Stack direction="row" spacing={2} mt={4}>
          <Button
            variant="contained"
            onClick={() => navigate("/dashboard/snippets")}
          >
            Open Snippet Manager
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard/snippets/create")}
          >
            Create Snippet
          </Button>
        </Stack>
      </Card>
    </DashboardLayout>
  );
}



