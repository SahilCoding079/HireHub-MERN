import nodemailer from "nodemailer";

const sendInterviewInvitationEmail = async ({ email, jobTitle, companyName, dateLabel, durationMinutes, mode, meetingLink, location, notes, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const locationDetails = mode === "online"
    ? `Join the interview: ${meetingLink}`
    : `Location: ${location}`;
  const text = [
    `Your interview for ${jobTitle} at ${companyName} has been scheduled.`,
    `When: ${dateLabel}`,
    `Duration: ${durationMinutes} minutes`,
    locationDetails,
    notes ? `Notes: ${notes}` : "",
  ].filter(Boolean).join("\n");

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: `Interview scheduled: ${jobTitle} at ${companyName}`,
    text,
    html,
  });
};

export default sendInterviewInvitationEmail;