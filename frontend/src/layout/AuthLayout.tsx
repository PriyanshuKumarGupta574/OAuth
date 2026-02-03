import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
