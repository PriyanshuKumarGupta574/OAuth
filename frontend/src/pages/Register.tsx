import {
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import GoogleIcon from "@mui/icons-material/Google";
import { registerUser } from "../services/auth.service";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register({
  switchToLogin,
}: {
  switchToLogin: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
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
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            variant="outlined"
            size="small"
          />

          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            variant="outlined"
            size="small"
          />

          <div className="flex gap-4">
            <TextField
              label="Phone"
              fullWidth
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
              variant="outlined"
              size="small"
            />

            <TextField
              label="DOB"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("dob")}
              error={!!errors.dob}
              helperText={errors.dob?.message}
              className="[&_.MuiOutlinedInput-root]:rounded-xl"
              variant="outlined"
              size="small"
            />
          </div>

          <TextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            variant="outlined"
            size="small"
          />

          <TextField
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            variant="outlined"
            size="small"
          />

          <div className="py-1">
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  {...register("acceptTerms")}
                  className="text-[#1a73e8]"
                />
              }
              label={
                <Typography className="text-slate-600 text-xs font-semibold">
                  I agree to the Terms & Conditions
                </Typography>
              }
            />
            {errors.acceptTerms && (
              <FormHelperText error className="ml-4">
                {errors.acceptTerms.message}
              </FormHelperText>
            )}
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
