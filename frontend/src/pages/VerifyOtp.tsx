import {
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { verifyEmailOtp, resendOtp } from "../services/auth.service";

import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import AuthLayout from "../layout/AuthLayout";

type OtpForm = {
  otp: string;
};

export default function VerifyOtp() {
  const { register, handleSubmit } = useForm<OtpForm>();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();


  const { email } = (location.state as { email: string }) || {};

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  const onSubmit = async (data: OtpForm) => {
    try {
      setLoading(true);
      await verifyEmailOtp(email, data.otp);
      toast.success("Email verified successfully");
      navigate("/dashboard");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    await resendOtp(email);
    setCooldown(30);

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };


  return (
    <AuthLayout>
      <div className="w-[420px] p-8 rounded-2xl bg-gradient-to-br from-white to-[#92a1b6] shadow-2xl border-none">
        <Typography variant="h5" className="mb-4 font-bold text-slate-800 text-center">
          Verify Email
        </Typography>

        <Typography variant="body2" className="mb-6 text-slate-600 text-center">
          Enter the 6-digit OTP sent to <b className="text-slate-800">{email}</b>
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <TextField
              label="OTP"
              {...register("otp", { required: true })}
              inputProps={{ maxLength: 6 }}
              className="[&_.MuiOutlinedInput-root]:rounded-xl text-center tracking-[0.5em] font-mono"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className="rounded-xl py-3 bg-[#1a73e8] hover:bg-[#1557b0] shadow-none font-bold normal-case text-lg"
            >
              Verify OTP
            </Button>

            <Button
              variant="text"
              disabled={cooldown > 0}
              onClick={handleResendOtp}
              className="normal-case font-semibold text-slate-600 hover:bg-white/30"
            >
              {cooldown > 0
                ? `Resend OTP in ${cooldown}s`
                : "Resend OTP"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
