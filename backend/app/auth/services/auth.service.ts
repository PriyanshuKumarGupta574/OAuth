import crypto from "crypto";
import User from "../schemas/user.schema";
import { hashPassword } from "../../common/helper/otp.helper";
import { sendResetPasswordEmail } from "../../common/services/email.service";

/* ================= FORGOT PASSWORD ================= */

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });

  // Prevent OAuth-only accounts from resetting password
  if (!user || !user.authProviders.includes("local")) return;

  const rawToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
  await sendResetPasswordEmail(user.email, resetUrl);
};

/* ================= RESET PASSWORD ================= */

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
  }).select("+password");

  if (!user) {
    throw new Error("Reset token is invalid or expired");
  }

  if (!user.authProviders.includes("local")) {
    throw new Error("Password reset not allowed for Google accounts");
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};



// import crypto from "crypto";
// import User from "../schemas/user.schema";
// import { hashPassword } from "../../common/helper/otp.helper";
// import { sendResetPasswordEmail } from "../../common/services/email.service";


// export const forgotPasswordService = async (email: string) => {
//   const user = await User.findOne({ email });
//   if (!user) return; 

//   const token = crypto.randomBytes(32).toString("hex");

//   user.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(token)
//     .digest("hex");

//   user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); 
//   await user.save();

//   const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

//   await sendResetPasswordEmail(user.email, resetUrl);
// };


// export const resetPasswordService = async (
//   token: string,
//   newPassword: string
// ) => {
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(token)
//     .digest("hex");

//   const user = await User.findOne({
//     resetPasswordToken: hashedToken,
//     resetPasswordExpires: { $gt: new Date() },
//   });

//   if (!user) {
//     throw new Error("Token invalid or expired");
//   }

//   user.password = await hashPassword(newPassword);
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;

//   await user.save();
// };
