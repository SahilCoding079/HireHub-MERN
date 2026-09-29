import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    scheduledAt: { type: Date, required: true },
    timeZone: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 15, max: 240 },
    mode: { type: String, enum: ["online", "in_person"], required: true },
    meetingLink: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
    scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false },
);

const applicationSchema = new mongoose.Schema(
  {
    job: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },
    statusUpdatedAt: {
      type: Date
    },
    interview: {
      type: interviewSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index(
  {job: 1, applicant: 1},
  {unique: true}
);
const Application = mongoose.model("Application", applicationSchema);
export default Application;
