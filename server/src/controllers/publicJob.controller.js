import mongoose from "mongoose";
import Job from "../models/job.model.js";
import ApiError from "../utils/ApiError.js";

export const getAllPublicJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentPage = Number(page);
    const pageLimit = Number(limit);
    const skip = (currentPage - 1) * pageLimit;

    const [allJobs, totalJobs] = await Promise.all([
      Job.find({ status: "active" })
        .populate("company", "name logo location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit),
      Job.countDocuments({ status: "active" }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully.",
      data: allJobs,
      pagination: {
        totalJobs,
        currentPage,
        totalPages: Math.ceil(totalJobs / pageLimit),
        limit: pageLimit,
      },
    });
  } catch (error) {
    return next(error);
  }
};
export const getPublicJobByID = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ApiError(400, "Invalid Job ID."));
  try {
    const getJob = await Job.findById(id).populate(
      "company",
      "name description website location logo",
    );
    if (!getJob) return next(new ApiError(404, "Job not found."));
    return res.status(200).json({
      success: true,
      data: getJob,
    });
  } catch (error) {
    return next(error);
  }
};
export const searchJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      jobType,
      experienceLevel,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: "active",
    };
    console.log("QUERY:", query);
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        {
          requirements: {
            $in: [new RegExp(keyword, "i")],
          },
        },
      ];
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, totalJobs] = await Promise.all([
      Job.find(query)
        .populate("company", "name logo location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Job.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully.",
      data: jobs,
      pagination: {
        totalJobs,
        currentPage: Number(page),
        totalPages: Math.ceil(totalJobs / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    return next(error);
  }
};
