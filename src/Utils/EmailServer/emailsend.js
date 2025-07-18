import dotenv from "dotenv";
import { SBtransporter } from "./server.js";
dotenv.config();

export const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await SBtransporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to,
      subject,
      html,
    });
    console.log("📧 Email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return { success: false, error };
  }
};
