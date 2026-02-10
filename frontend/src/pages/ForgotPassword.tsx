import {
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import AuthLayout from "../layout/AuthLayout";
import { forgotPassword } from "../services/auth.service";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    try {
      await forgotPassword(data.email);
      toast.success("Password reset link sent to your email");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <AuthLayout>
      <div className="w-[420px] p-8 rounded-2xl bg-gradient-to-br from-white to-[#92a1b6] shadow-2xl border-none">
        <Typography variant="h5" className="mb-4 font-bold text-slate-800">
          Forgot Password
        </Typography>

        <Typography variant="body2" className="mb-6 text-slate-600">
          Enter your email to receive a password reset link.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-4">
            <TextField
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
            />

            <Button
              type="submit"
              variant="contained"
              className="rounded-xl py-3 bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case"
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
