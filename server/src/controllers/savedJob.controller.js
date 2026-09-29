import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import Job from "../models/job.model.js";
import SavedJob from "../models/savedJob.model.js";

export const saveJob = async(req, res, next) => {
  const {jobId} = req.params;
  if(!mongoose.Types.ObjectId.isValid(jobId))
    return next(new ApiError(400, "Invalid ID"));
  try {
    const job = await Job.findById(jobId);
    if(!job)
      return next(new ApiError(404, "Job not found."));
    const existingSavedJob = await SavedJob.findOne({
      job: jobId,
      user: req.user._id
    });
    if(existingSavedJob)
      return next(new ApiError(409, "Job already saved."));
    const savedJob = await SavedJob.create({
      job: jobId,
      user: req.user._id
    })
    return res.status(200).json({
      success: true,
      message: "Job saved successfully",
      data: savedJob
    })
  } catch (error) {
    if(error.code === 11000)
      return next(new ApiError(409, "Job already saved."));
    return next(error);
  }
};

export const getSavedJobs = async(req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentPage = Number(page);
    const pageLimit = Number(limit);
    const skip = (currentPage - 1) * pageLimit;
    const filter = { user: req.user._id };

    const [saveJobs, totalSavedJobs] = await Promise.all([
      SavedJob.find(filter)
        .populate({
          path: "job",
          populate: {
            path: "company",
            select: "name logo location"
          }
        })
        .sort({createdAt: -1})
        .skip(skip)
        .limit(pageLimit),
      SavedJob.countDocuments(filter),
    ]);
    return res.status(200).json({
      success: true,
      message: "Job fetched successfully.",
      data: saveJobs,
      pagination: {
        totalSavedJobs,
        currentPage,
        totalPages: Math.ceil(totalSavedJobs / pageLimit),
        limit: pageLimit,
      },
    })
  } catch (error) {
    return next(error);
  }
};

export const deleteSavedJob = async(req, res, next) => {
  const {jobId} = req.params;
  if(!mongoose.Types.ObjectId.isValid(jobId))
    return next(new ApiError(400, "Invalid ID."));
  try {
    const deleteSavedJob = await SavedJob.findOneAndDelete({
      job: jobId,
      user: req.user._id
    });
    if(!deleteSavedJob)
      return next(new ApiError(404, "Saved job not found."));
    return res.status(200).json({
      success: true,
      message: "Job removed successfully."
    });
  } catch (error) {
    return next(error);
  }
};