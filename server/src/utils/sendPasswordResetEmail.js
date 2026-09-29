import nodemailer from "nodemailer";

const sendPasswordResetEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your HireHub password",
    text: `Reset your HireHub password using this link: ${resetUrl}. This link expires in 15 minutes.`,
    html: `<p>Reset your HireHub password using the link below. It expires in 15 minutes.</p><p><a href="${resetUrl}">Reset password</a></p>`,
  });
};

export default sendPasswordResetEmail;