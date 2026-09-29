import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import ApiError from "../utils/ApiError.js";

export const getAllNotifications = async(req, res, next)=> {
  try {
    const notifications = await Notification.find({
      recepient: req.user._id
    }).populate("job", "title").populate("application", "status").sort({createdAt: -1});
    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      data: notifications
    });
  } catch (error) {
    return next(error);
  }
};
export const marksAsRead = async(req, res, next) => {
  const {notificationId} = req.params;
  if(!mongoose.Types.ObjectId.isValid(notificationId))
    return next(new ApiError(400, "Invalid notification ID."));
  try {
    const notification = await Notification.findOneAndUpdate({
      _id: notificationId,
      recepient: req.user._id
    },
    {
      isRead: true
    },
    {
      new: true
    }
  );
  if(!notification)
    return next(new ApiError(404, "Notification not found."));
  return res.status(200).json({
    success: true,
    message: "Notification marked as read.",
    data: notification
  });
  } catch (error) {
    return next(error);
  }
};
export const markAllAsRead = async(req, res, next)=> {
  try {
    await Notification.updateMany({
      recepient: req.user._id,
      isRead: false
    },
    {
      isRead: true
    }
  );
  return res.status(200).json({
    success: true,
    message: "All notifications marked as read."
  });
  } catch (error) {
    return next(error);
  }
};
export const deleteNotification = async(req, res, next) => {
  const {notificationId} = req.params;
  if(!mongoose.Types.ObjectId.isValid(notificationId))
    return next(new ApiError(400, "Invalid notification ID."));
  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recepient: req.user._id
    });
    if(!notification)
      return next(new ApiError(404, "Notification not found."));
    return res.status(200).json({
      sucess: true,
      message: "Notification deleted successfully."
    })
  } catch (error) {
    return next(error);
  }
};

export const deleteAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ recepient: req.user._id });
    return res.status(200).json({
      success: true,
      message: "All notifications deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};