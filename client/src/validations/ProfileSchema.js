import { z } from "zod";

export const ProfileSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters long"),
  phone: z.string().trim().max(20, "Phone number is too long").optional().or(z.literal("")),
  bio: z.string().trim().max(500, "Bio must be 500 characters or less").optional().or(z.literal("")),
  skills: z.string().trim().min(1, "Add at least one skill"),
});
