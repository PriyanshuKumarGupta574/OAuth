import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700, color: "#1e293b" },
    h6: { fontWeight: 600, color: "#334155" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  palette: {
    primary: { main: "#4f46e5", light: "#818cf8", dark: "#3730a3" }, // Indigo
    secondary: { main: "#9333ea", light: "#c084fc", dark: "#7e22ce" }, // Purple
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#64748b" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": { boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" },
        },
        contained: {
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            "& fieldset": { borderColor: "#e2e8f0" },
            "&:hover fieldset": { borderColor: "#cbd5e1" },
            "&.Mui-focused fieldset": { borderColor: "#4f46e5", borderWidth: 1.5 },
          },
        },
      },
    },
  },
});
