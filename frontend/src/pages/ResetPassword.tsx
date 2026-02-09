import {
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import AuthLayout from "../layout/AuthLayout";
import { resetPassword } from "../services/auth.service";
import { toast } from "react-toastify";

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
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token!, data.password);
      toast.success("Password reset successful");
      navigate("/");
    } catch {
      toast.error("Invalid or expired link");
    }
  };

  return (
    <AuthLayout>
      <div className="w-[420px] p-8 rounded-2xl bg-gradient-to-br from-white to-[#92a1b6] shadow-2xl border-none">
        <Typography variant="h5" className="mb-6 font-bold text-slate-800 text-center">
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <TextField
              label="New Password"
              type="password"
              {...register("password", { required: true })}
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
            />

            <TextField
              label="Confirm Password"
              type="password"
              {...register("confirmPassword", { required: true })}
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
            />

            <Button
              type="submit"
              variant="contained"
              className="rounded-xl py-3 bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case text-lg mt-2"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
