import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const SBtransporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SENDINBLUE_USER,
    pass: process.env.SENDINBLUE_PASS,
  },
  debug: true,
});

SBtransporter.verify()
  .then(() => console.log("✅ SMTP Verified"))
  .catch((err) => {
    console.error("❌ SMTP Error:", err);
  });
