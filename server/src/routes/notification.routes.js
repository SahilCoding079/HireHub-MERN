import express from "express";
import {verifyJwt} from "../middleware/auth.middleware.js";
import {
	deleteAllNotifications,
	deleteNotification,
	getAllNotifications,
	markAllAsRead,
	marksAsRead,
} from "../controllers/notification.controller.js";

const notificationRouter = express.Router();
notificationRouter.use(verifyJwt);

notificationRouter.get("/", getAllNotifications);
notificationRouter.patch("/:notificationId/read", marksAsRead);
notificationRouter.patch("/read-all", markAllAsRead);
notificationRouter.delete("/all", deleteAllNotifications);
notificationRouter.delete("/:notificationId", deleteNotification);

export default notificationRouter;