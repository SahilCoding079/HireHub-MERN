import nodemailer from "nodemailer";

const createSmtpTransporter = () => {
  const missingSettings = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"].filter(
    (setting) => !process.env[setting]?.trim(),
  );

  if (missingSettings.length) {
    throw new Error(
      `Email delivery is not configured. Set ${missingSettings.join(", ")} in the server environment.`,
    );
  }

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number between 1 and 65535.");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST.trim(),
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export default createSmtpTransporter;