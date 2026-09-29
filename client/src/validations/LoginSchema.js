import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email!").min(1, "Email is required").trim(),
  password: z.string().min(1, "Password is required!").min(6, "Password must be at least 6 characters long").trim(),
});
