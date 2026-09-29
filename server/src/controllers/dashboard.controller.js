import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      recentApplications,
    ] = await Promise.all([
      Application.countDocuments({
        applicant: userId,
      }),
      Application.countDocuments({
        applicant: userId,
        status: "pending",
      }),
      Application.countDocuments({
        applicant: userId,
        status: "accepted",
      }),
      Application.countDocuments({
        applicant: userId,
        status: "rejected",
      }),
      Application.find({
        applicant: userId,
      })
        .populate({
          path: "job",
          select: "title location jobType salary experienceLevel company",
          populate: {
            path: "company",
            select: "name logo location",
          },
        })
        .sort({ createdAt: -1 })
        .limit(5),
    ]);
    return res.status(200).json({
      success: true,
      message: "User dashboard fetched successfully.",
      data: {
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        recentApplications,
      },
    });
  } catch (error) {
    return next(error);
  }
};
export const getRecruiterDashboard = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;
    const recruiterJobs = await Job.find({
      createdBy: recruiterId,
    }).select("_id");
    const jobIds = recruiterJobs.map((job) => job._id);
    const [
      totalJobs,
      totalActiveJobs,
      totalClosedJobs,
      uniqueApplicants,
      recentApplications,
    ] = await Promise.all([
      Job.countDocuments({
        createdBy: recruiterId,
      }),
      Job.countDocuments({
        createdBy: recruiterId,
        status: "active",
      }),
      Job.countDocuments({
        createdBy: recruiterId,
        status: "closed",
      }),
      Application.aggregate([
        {
          $match: {
            job: {$in: jobIds},
          },
        },
        {
          $group: {
            _id: "$applicant"
          },
        },
        {
          $count: "total"
        },
      ]),
      Application.find({
        job: { $in: jobIds },
      })
        .populate("applicant", "fullName email profilePhoto")
        .populate("job", "title location jobType")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);
    const totalUniqueApplicants = uniqueApplicants.length > 0 ? uniqueApplicants[0].total : 0;
    return res.status(200).json({
      success: true,
      message: "Recruiter dashboard fetched successfully.",
      data: {
        totalJobs,
        totalActiveJobs,
        totalClosedJobs,
        uniqueApplicants: totalUniqueApplicants,
        recentApplications,
      },
    });
  } catch (error) {
    return next(error);
  }
};
