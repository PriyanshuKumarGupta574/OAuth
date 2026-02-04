import {
  Card,
  TextField,
  Button,
  Typography,
  Stack,
  Link,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login({
  switchToRegister,
}: {
  switchToRegister: () => void;
}) {
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();
  const { login } = useAuth();


  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await loginUser({
        email: data.email.trim().toLowerCase(), 
        password: data.password,
      });

      login(res.data.accessToken);

    
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };

  
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <Card sx={{ width: 420, p: 4, borderRadius: "16px",
    background: "linear-gradient(135deg, #ffffff 0%, #92a1b6 100%)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
     }}>
      <Typography variant="h5" mb={2}>
        Login
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            {...register("email", { required: true })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register("password", { required: true })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ borderRadius: "12px" }}
          >
            Login
          </Button>

        
          <Button
            variant="outlined"
            fullWidth
            sx={{ borderRadius: "12px", color: "blue" }}
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>

      
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
            >
              Forgot password?
            </Link>

            <Link
              component="button"
              variant="body2"
              onClick={switchToRegister}
            >
              Register
            </Link>
          </Box>
        </Stack>
      </form>
    </Card>
  );
}













