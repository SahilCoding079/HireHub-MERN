import { z } from "zod";

export const InterviewSchema = z
  .object({
    scheduledAt: z.string().min(1, "Choose an interview date and time."),
    durationMinutes: z.coerce
      .number()
      .int("Duration must be a whole number of minutes.")
      .min(15, "Interview must be at least 15 minutes.")
      .max(240, "Interview cannot exceed 4 hours."),
    mode: z.enum(["online", "in_person"], {
      message: "Choose an interview format.",
    }),
    meetingLink: z.string().trim(),
    location: z.string().trim(),
    notes: z.string().trim().max(500, "Notes must be 500 characters or less."),
  })
  .superRefine((values, context) => {
    const scheduledDate = new Date(values.scheduledAt);
    if (!values.scheduledAt || Number.isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      context.addIssue({
        code: "custom",
        path: ["scheduledAt"],
        message: "Choose a date and time in the future.",
      });
    }

    if (values.mode === "online") {
      try {
        const url = new URL(values.meetingLink);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        context.addIssue({
          code: "custom",
          path: ["meetingLink"],
          message: "Enter a valid HTTP or HTTPS meeting link.",
        });
      }
    }

    if (values.mode === "in_person" && !values.location) {
      context.addIssue({
        code: "custom",
        path: ["location"],
        message: "Enter the interview location.",
      });
    }
  });

export const interviewFormDefaults = {
  scheduledAt: "",
  durationMinutes: 30,
  mode: "online",
  meetingLink: "",
  location: "",
  notes: "",
};