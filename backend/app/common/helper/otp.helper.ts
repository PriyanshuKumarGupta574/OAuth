import bcrypt from "bcryptjs";
import crypto from "crypto";



export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};



export const generateOtp = (): string => {
  
  return crypto.randomInt(100000, 999999).toString();
};

export const hashOtp = (otp: string): string => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};






