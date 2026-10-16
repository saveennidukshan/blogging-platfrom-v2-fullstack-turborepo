import nodemailer from "nodemailer";
import { configs } from "./configs.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: configs.email_user,
    pass: configs.email_pass,
  },
});

try {
  await transporter.verify();
  console.log("Server is ready to take our messages");
} catch (err) {
  console.error("Verification failed:", err);
}

export default transporter;