import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineContent,
} from "@mui/lab";
import DashboardLayout from "../layout/DashboardLayout";

const cardStyle = {
  borderRadius: 3,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  background:
                  "linear-gradient(135deg, #f5f7ff 0%, #6e89b0 100%)",
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Welcome to Dashboard 
        </Typography>
        
      </Box>

   
      <Grid container spacing={3} mb={4}>
        {[
          { title: "Total Logins", value: "24" },
          { title: "Last Login", value: "Today" },
          { title: "Auth Method", value: "Google" },
          { title: "Account Status", value: "Active" },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                ...cardStyle,
                background:
                  "linear-gradient(135deg, #f5f7ff 0%, #6e89b0  100%)",
              }}
            >
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {item.title}
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

  
      <Grid container spacing={3}>
        {/* PROFILE */}
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                User Profile
              </Typography>

              <Box display="flex" gap={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 100,
                    height: 200,
                    bgcolor: "primary.main",
                    fontSize: 22,
                    fontWeight: 600,
                  }}
                >
                  U
                </Avatar>

                <Box>
                  <Typography fontWeight={600}>
                    ppriyanshu.75way@@gmail.com
                  </Typography>
                  <Chip
                    label="Google Auth"
                    color="success"
                    size="medium"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Activity
              </Typography>

              <Timeline>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                  </TimelineSeparator>
                  <TimelineContent>
                    Logged in with Google
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="success" />
                  </TimelineSeparator>
                  <TimelineContent>
                    Email verified
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot />
                  </TimelineSeparator>
                  <TimelineContent>
                    Password updated
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Recent Logins
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Device</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Chrome (Windows)</TableCell>
                    <TableCell>India</TableCell>
                    <TableCell>Today</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Edge (Windows)</TableCell>
                    <TableCell>India</TableCell>
                    <TableCell>Yesterday</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}


// import { Card, Typography } from "@mui/material";
// import DashboardLayout from "../layout/DashboardLayout";

// export default function Dashboard() {
//   return (
//     <DashboardLayout>
//       <Card sx={{ p: 4, borderRadius: "16px" }}>
//         <Typography variant="h4">Welcome to Dashboard 🎉</Typography>
//         <Typography mt={2}>
//           You have successfully logged in.
//         </Typography>
//       </Card>
//     </DashboardLayout>
//   );
// }
