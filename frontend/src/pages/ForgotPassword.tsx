import {
  Card,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import AuthLayout from "../layout/AuthLayout";
import { forgotPassword } from "../services/auth.service";

type ForgotForm = {
  email: string;
};

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm<ForgotForm>();

  const onSubmit = async (data: ForgotForm) => {
    try {
      await forgotPassword(data.email);
      alert("Password reset link sent to your email");
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <AuthLayout>
      <Card sx={{ width: 420, p: 4, borderRadius: "16px" }}>
        <Typography variant="h5" mb={2}>
          Forgot Password
        </Typography>

        <Typography variant="body2" mb={2}>
          Enter your email to receive a password reset link.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              {...register("email", { required: true })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: "12px" }}
            >
              Send Reset Link
            </Button>
          </Stack>
        </form>
      </Card>
    </AuthLayout>
  );
}
