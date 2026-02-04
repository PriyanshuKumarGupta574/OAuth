import {
  Card,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { verifyEmailOtp, resendOtp } from "../services/auth.service";

import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

type OtpForm = {
  otp: string;
};

export default function VerifyOtp() {
  const { register, handleSubmit } = useForm<OtpForm>();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

 
  const email = (location.state as any)?.email;

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
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Invalid OTP");
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
    <Card sx={{ width: 420, p: 4, borderRadius: "16px", 
         background: "linear-gradient(135deg, #ffffff 0%, #92a1b6 100%)",
         boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", }}>
      <Typography variant="h5" mb={2}>
        Verify Email
      </Typography>

      <Typography variant="body2" mb={2}>
        Enter the 6-digit OTP sent to <b>{email}</b>
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="OTP"
            {...register("otp", { required: true })}
            inputProps={{ maxLength: 6 }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            Verify OTP
          </Button>

          <Button
            variant="text"
            disabled={cooldown > 0}
            onClick={handleResendOtp}
          >
            {cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : "Resend OTP"}
          </Button>
        </Stack>
      </form>
    </Card>
  );
}


