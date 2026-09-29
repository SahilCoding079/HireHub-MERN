import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recepient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "application_submitted",
      "application_rejected",
      "application_accepted",
    ],
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true
}
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;