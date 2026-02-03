import bcrypt from "bcryptjs";
import crypto from "crypto";



export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
) => {
  return bcrypt.compare(password, hash);
};



export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOtp = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
