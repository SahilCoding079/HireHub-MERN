import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import Notification from "../models/notification.model.js";
import sendInterviewInvitationEmail from "../utils/sendInterviewInvitationEmail.js";

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );

export const applyJob = async (req, res, next) => {
  const { jobId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(jobId))
    return next(new ApiError(400, "Invalid Job ID."));
  if (!req.user) return next(new ApiError(401, "User is required."));
  try {
    const job = await Job.findById(jobId);
    if (!job) return next(new ApiError(404, "Job not found."));
    const existingApplicant = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existingApplicant)
      return next(new ApiError(409, "You have already applied to this job."));
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
    });
    await Notification.create({
      recepient: job.createdBy,
      type: "application_submitted",
      message: `${req.user.fullName} applied for your ${job.title} job.`,
      job: job._id,
      application: application._id,
    });
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      data: application,
    });
  } catch (error) {
    if (error?.code === 11000)
      return next(new ApiError(409, "You've already applied for this job."));
    return next(error);
  }
};
export const appliedJob = async (req, res, next) => {
  const applicant = req.user._id;
  try {
    const allJobs = await Application.find({ applicant })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name location logo",
        },
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: allJobs,
    });
  } catch (error) {
    return next(error);
  }
};
export const getApplicants = async (req, res, next) => {
  const { jobId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(jobId))
    return next(new ApiError(400, "Invalid Job ID."));
  try {
    const jobExists = await Job.findOne({
      _id: jobId,
      createdBy: req.user._id,
    });
    if (!jobExists) return next(new ApiError(404, "Job not found."));
    const allApplicants = await Application.find({
      job: jobId,
    })
      .populate("applicant", "fullName email profilePhoto")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      success: true,
      message: "Applicants fetched successfully",
      data: allApplicants,
    });
  } catch (error) {
    return next(error);
  }
};
export const getApplicantDetails = async (req, res, next) => {
  const { applicationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(applicationId))
    return next(new ApiError(400, "Invalid application ID."));
  try {
    const application = await Application.findById(applicationId)
      .populate(
        "applicant",
        "fullName email profilePhoto phone bio skills resume resumeOriginalName",
      )
      .populate(
        "job",
        "title createdBy company location jobType salary experienceLevel",
      );
    if (!application) return next(new ApiError(404, "Application not found."));
    if (!application.job.createdBy.equals(req.user._id))
      return next(new ApiError(403, "Forbidden."));
    return res.status(200).json({
      success: true,
      message: "Applicant details fetched successfully",
      data: application,
    });
  } catch (error) {
    return next(error);
  }
};
export const updateStatus = async (req, res, next) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(applicationId))
    return next(new ApiError(400, "Invalid application ID."));
  const allowedStatus = ["pending", "accepted", "rejected"];
  if (!allowedStatus.includes(status))
    return next(new ApiError(400, "Invalid status."));
  try {
    const application =
      await Application.findById(applicationId).populate("job");
    if (!application) return next(new ApiError(404, "Application not found."));
    if (!application.job.createdBy.equals(req.user._id))
      return next(new ApiError(403, "Forbidden."));
    application.status = status;
    application.statusUpdatedAt = new Date();
    await application.save();
    if (status !== "pending") {
      await Notification.create({
        recepient: application.applicant,
        type:
          status === "accepted"
            ? "application_accepted"
            : "application_rejected",
        message: `Your application for ${application.job.title} was ${status}.`,
        job: application.job._id,
        application: application._id,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      data: application,
    });
  } catch (error) {
    return next(error);
  }
};

export const scheduleInterview = async (req, res, next) => {
  const { applicationId } = req.params;
  const {
    scheduledAt,
    timeZone,
    durationMinutes,
    mode,
    meetingLink = "",
    location = "",
    notes = "",
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(applicationId))
    return next(new ApiError(400, "Invalid application ID."));

  const interviewDate = new Date(scheduledAt);
  if (
    !scheduledAt ||
    Number.isNaN(interviewDate.getTime()) ||
    interviewDate <= new Date()
  )
    return next(
      new ApiError(
        400,
        "Choose a valid interview date and time in the future.",
      ),
    );
  if (typeof timeZone !== "string" || timeZone.length > 100)
    return next(new ApiError(400, "A valid time zone is required."));
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(interviewDate);
  } catch {
    return next(new ApiError(400, "A valid time zone is required."));
  }
  if (
    !Number.isInteger(Number(durationMinutes)) ||
    Number(durationMinutes) < 15 ||
    Number(durationMinutes) > 240
  )
    return next(
      new ApiError(
        400,
        "Interview duration must be between 15 and 240 minutes.",
      ),
    );
  if (!["online", "in_person"].includes(mode))
    return next(
      new ApiError(400, "Choose online or in-person interview mode."),
    );
  if (typeof notes !== "string" || notes.length > 500)
    return next(
      new ApiError(400, "Interview notes must be 500 characters or less."),
    );

  let normalizedMeetingLink = "";
  if (mode === "online") {
    try {
      const parsedLink = new URL(meetingLink);
      if (!["http:", "https:"].includes(parsedLink.protocol)) throw new Error();
      normalizedMeetingLink = parsedLink.toString();
    } catch {
      return next(
        new ApiError(400, "Enter a valid HTTP or HTTPS meeting link."),
      );
    }
  } else if (typeof location !== "string" || !location.trim()) {
    return next(new ApiError(400, "Enter the interview location."));
  }

  try {
    const application = await Application.findById(applicationId)
      .populate("applicant", "fullName email")
      .populate({ path: "job", populate: { path: "company", select: "name" } });
    if (!application) return next(new ApiError(404, "Application not found."));
    if (!application.job.createdBy.equals(req.user._id))
      return next(new ApiError(403, "Forbidden."));

    const previousInterview = application.interview?.toObject();
    application.interview = {
      scheduledAt: interviewDate,
      timeZone,
      durationMinutes: Number(durationMinutes),
      mode,
      meetingLink: normalizedMeetingLink,
      location: mode === "in_person" ? location.trim() : "",
      notes: notes.trim(),
      scheduledBy: req.user._id,
    };
    await application.save();

    try {
      const dateLabel = interviewDate.toLocaleString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
        timeZone,
      });
      const jobTitle = application.job.title;
      const companyName = application.job.company?.name || "HireHub";
      const safeJobTitle = escapeHtml(jobTitle);
      const safeCompanyName = escapeHtml(companyName);
      const safeCandidateName = escapeHtml(application.applicant.fullName);
      const safeDateLabel = escapeHtml(dateLabel);
      const interviewDetails =
        mode === "online"
          ? `<p>Join the interview: <a href="${escapeHtml(normalizedMeetingLink)}">${escapeHtml(normalizedMeetingLink)}</a></p>`
          : `<p>Location: ${escapeHtml(location.trim())}</p>`;
      const safeNotes = notes.trim()
        ? `<p>Notes: ${escapeHtml(notes.trim())}</p>`
        : "";

      await sendInterviewInvitationEmail({
        email: application.applicant.email,
        candidateName: application.applicant.fullName,
        jobTitle,
        companyName,
        dateLabel,
        durationMinutes: Number(durationMinutes),
        mode,
        meetingLink: normalizedMeetingLink,
        location: location.trim(),
        notes: notes.trim(),
        html: `<p>Hello ${safeCandidateName},</p><p>Your interview for <strong>${safeJobTitle}</strong> at ${safeCompanyName} has been scheduled.</p><p><strong>${safeDateLabel}</strong><br>Duration: ${Number(durationMinutes)} minutes</p>${interviewDetails}${safeNotes}<p>We look forward to speaking with you.</p>`,
      });
    } catch (emailError) {
      application.interview = previousInterview || null;
      await application.save();
      return next(
        new ApiError(
          502,
          "The interview invitation could not be emailed. Check SMTP settings and try again.",
        ),
      );
    }

    return res.status(200).json({
      success: true,
      message: "Interview scheduled and invitation emailed to the candidate.",
      data: application,
    });
  } catch (error) {
    return next(error);
  }
};
