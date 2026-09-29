import { z } from "zod";

export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must at least 3 characters long")
      .min(1, "Full name is required")
      .trim(),
    email: z
      .string()
      .email("Invalid email!")
      .min(1, "Email is required")
      .trim(),
    password: z
      .string()
      .min(1, "Password is required!")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Password is required!")
      .min(6, "Password must be at least 6 characters long"),
    role: z.enum(["user", "recruiter"], {
      message: "Please choose an account type",
    }),
    profilePhoto: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });
