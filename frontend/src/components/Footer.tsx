import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 2,
        mt: "auto",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="body2">
        © 2026 Authentication System
      </Typography>
    </Box>
  );
}
