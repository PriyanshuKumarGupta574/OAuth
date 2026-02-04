import {
  Card,
  TextField,
  Button,
  Typography,
  Stack,
  Link,
  Divider,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import GoogleIcon from "@mui/icons-material/Google";
import { registerUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dob: string;
  acceptTerms: boolean;
};

export default function Register({
  switchToLogin,
}: {
  switchToLogin: () => void;
}) {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!data.acceptTerms) {
      toast.warn("Please accept Terms & Conditions");
      return;
    }

    try {
      await registerUser({
        email: data.email,
        password: data.password,
      });

     
      navigate("/verify-otp", {
        state: { email: data.email },
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <Card
      sx={{
        // width: 420,
        // p: 3,
        // borderRadius: "16px",
     width: 420,
    //  height: 500,
    p: 4,
    borderRadius: 3,
    background: "linear-gradient(135deg, #ffffff 0%, #92a1b6 100%)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
      }}
    >
      <Typography variant="h6" mb={1.5}>
        Create Account
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1.8}>
          <TextField
            size="small"
            label="Full Name"
            {...register("name", { required: true })}
          />

          <TextField
            size="small"
            label="Email"
            type="email"
            {...register("email", { required: true })}
          />

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <TextField
              size="small"
              label="Phone"
              fullWidth
              {...register("phone", { required: true })}
            />

            <TextField
              size="small"
              label="DOB"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("dob", { required: true })}
            />
          </Box>

          <TextField
            size="small"
            label="Password"
            type="password"
            {...register("password", { required: true })}
          />

          <TextField
            size="small"
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", { required: true })}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                {...register("acceptTerms", { required: true })}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the Terms & Conditions
              </Typography>
            }
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: "12px" }}
          >
            Register with Email
          </Button>

          <Divider>OR</Divider>

          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleRegister}
            sx={{ borderRadius: "12px", textTransform: "none", color: "blue" }}
          >
            Register with Google
          </Button>

          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link component="button" onClick={switchToLogin}>
              Login
            </Link>
          </Typography>
        </Stack>
      </form>
    </Card>
  );
}


