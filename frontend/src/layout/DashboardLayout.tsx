import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FolderSidebar from "../components/FolderSidebar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

   
      <Box sx={{ flex: 1, display: "flex" }}>
        
        <FolderSidebar />

        
        <Box
          sx={{
            flex: 1,
            px: { xs: 2, md: 4 },
            py: 3,
            maxWidth: "1200px",
            mx: "auto",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}



