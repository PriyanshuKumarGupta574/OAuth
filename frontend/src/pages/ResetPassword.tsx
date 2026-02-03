import {
  Card,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import { resetPassword } from "../services/auth.service";

type ResetForm = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<ResetForm>();

  const onSubmit = async (data: ResetForm) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token!, data.password);
      alert("Password reset successful");
      navigate("/");
    } catch {
      alert("Invalid or expired link");
    }
  };

  return (
    <AuthLayout>
      <Card sx={{ width: 420, p: 4, borderRadius: "16px" }}>
        <Typography variant="h5" mb={2}>
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="New Password"
              type="password"
              {...register("password", { required: true })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />

            <TextField
              label="Confirm Password"
              type="password"
              {...register("confirmPassword", { required: true })}
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
              Reset Password
            </Button>
          </Stack>
        </form>
      </Card>
    </AuthLayout>
  );
}
