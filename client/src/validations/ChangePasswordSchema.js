import { z } from "zod";

export const PasswordResetRequestSchema = z.object({
  email: z.string().email("Enter a valid email address").min(1, "Email is required").trim(),
});

export const PasswordResetSchema = z
  .object({
    email: z.string().email("Enter a valid email address").min(1, "Email is required").trim(),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
