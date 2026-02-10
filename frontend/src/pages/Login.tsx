import {
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login({
  switchToRegister,
}: {
  switchToRegister: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
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
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Login error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="w-[420px] p-8 rounded-2xl bg-gradient-to-br from-white to-[#92a1b6] shadow-2xl border-none">
      <Typography variant="h5" className="mb-8 font-extrabold text-slate-800">
        Login
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-6">
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            variant="outlined"
          />

          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            className="[&_.MuiOutlinedInput-root]:rounded-xl"
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="rounded-xl py-3.5 bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case text-lg"
          >
            Login
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleGoogleLogin}
            className="rounded-xl py-3.5 border-slate-200 text-slate-600 hover:bg-slate-50 shadow-none font-bold normal-case text-lg flex gap-3 items-center justify-center"
          >
            <GitHubIcon className="text-slate-800" fontSize="small" />
            Sign in with Google
          </Button>

          <div className="flex justify-between items-center mt-4">
            <Link
              component={RouterLink}
              to="/forgot-password"
              className="text-slate-500 hover:text-[#1a73e8] no-underline font-semibold text-sm transition-colors"
            >
              Forgot password?
            </Link>

            <button
              type="button"
              onClick={switchToRegister}
              className="text-[#1a73e8] hover:text-[#1557b0] font-bold text-sm transition-colors bg-transparent border-none cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
