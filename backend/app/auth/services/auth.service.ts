
import crypto from "crypto";
import User from "../schemas/user.schema";
import { hashPassword } from "../../common/helper/otp.helper";
import { sendResetPasswordEmail } from "../../common/services/email.service";


export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) return; 

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); 
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await sendResetPasswordEmail(user.email, resetUrl);
};


export const resetPasswordService = async (
  token: string,
  newPassword: string
) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Token invalid or expired");
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};
