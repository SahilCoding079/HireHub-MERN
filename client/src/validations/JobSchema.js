import { z } from "zod";

export const jobSchema = z.object({
	title: z.string().trim().min(3, "Job title must be at least 3 characters."),
	company: z.string().min(1, "Select a company."),
	location: z.string().trim().min(2, "Location is required."),
	jobType: z.string().min(1, "Select a job type."),
	description: z.string().trim().min(40, "Add at least 40 characters describing the role."),
	requirements: z.string().trim().min(10, "Add the key requirements for this role."),
	salary: z.coerce.number().positive("Salary must be greater than zero."),
	experienceLevel: z.string().min(1, "Select an experience level."),
	position: z.coerce.number().int().positive("Add at least one opening."),
	status: z.enum(["active", "closed", "draft"]),
});

export const jobFormDefaults = {
	title: "",
	company: "",
	location: "",
	jobType: "",
	description: "",
	requirements: "",
	salary: "",
	experienceLevel: "",
	position: 1,
	status: "active",
};
