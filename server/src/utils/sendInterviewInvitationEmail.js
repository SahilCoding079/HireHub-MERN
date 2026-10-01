import createSmtpTransporter from "./createSmtpTransporter.js";

const sendInterviewInvitationEmail = async ({ email, jobTitle, companyName, dateLabel, durationMinutes, mode, meetingLink, location, notes, html }) => {
  const transporter = createSmtpTransporter();

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