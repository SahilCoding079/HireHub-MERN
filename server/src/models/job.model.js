import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required."],
      trim: true,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    salary: {
      type: Number,
      required: [true, "Salary is required."],
    },
    experienceLevel: {
      type: String,
      enum: ["Fresher", "1-2 years", "3-4 years","5+ years"],
      required: [true, "Experience level is required."],
    },
    location: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["Part-time", "Full-time", "Internship", "Contract"],
      required: true,
    },
    position: {
      type: Number,
      required: [true, "Number of openings is required."],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active"
    }
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model('Job',jobSchema);
export default Job;