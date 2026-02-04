import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  // useEffect(() => {
  //   const token = params.get("token");

  //   if (!token) {
  //     navigate("/");
  //     return;
  //   }

  //   // save token
  //   login(token);

  //   // redirect to dashboard
  //  navigate("/dashboard", { replace: true });
  // }, []);
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress />
      <Typography mt={2}>Signing you in...</Typography>
    </Box>
  );
}
