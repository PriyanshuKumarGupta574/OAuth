import {
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import GoogleIcon from "@mui/icons-material/Google";
import { registerUser } from "../services/auth.service";
import { useNavigate } from "react-router";
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="w-[420px] p-8 rounded-2xl bg-gradient-to-br from-white to-[#92a1b6] shadow-2xl border-none">
      <Typography variant="h5" className="mb-8 font-extrabold text-slate-800">
        Create Account
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-5">
          <TextField
            label="Full Name"
            {...register("name", { required: true })}
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            variant="outlined"
            size="small"
          />

          <TextField
            label="Email"
            type="email"
            {...register("email", { required: true })}
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            variant="outlined"
            size="small"
          />

          <div className="flex gap-4">
            <TextField
              label="Phone"
              fullWidth
              {...register("phone", { required: true })}
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
              variant="outlined"
              size="small"
            />

            <TextField
              label="DOB"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("dob", { required: true })}
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
              variant="outlined"
              size="small"
            />
          </div>

          <TextField
            label="Password"
            type="password"
            {...register("password", { required: true })}
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            variant="outlined"
            size="small"
          />

          <TextField
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", { required: true })}
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            variant="outlined"
            size="small"
          />

          <div className="py-1">
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  {...register("acceptTerms", { required: true })}
                  className="text-[#1a73e8]"
                />
              }
              label={
                <Typography className="text-slate-600 text-xs font-semibold">
                  I agree to the Terms & Conditions
                </Typography>
              }
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="rounded-xl py-3 bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case text-base"
          >
            Create Account
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            onClick={handleGoogleRegister}
            className="rounded-xl py-3 border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case text-base"
          >
            Sign up with Google
          </Button>

          <Typography className="text-slate-500 text-center text-sm mt-4 font-medium">
            Already have an account?{" "}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-[#1a73e8] hover:text-[#1557b0] font-bold no-underline transition-colors bg-transparent border-none cursor-pointer"
            >
              Login
            </button>
          </Typography>
        </div>
      </form>
    </div>
  );
}
