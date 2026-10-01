import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import companyRouter from "./routes/company.routes.js";
import publicCompanyRouter from "./routes/publicCompany.routes.js";
import jobRouter from "./routes/job.routes.js";
import publicJobRoute from "./routes/publicJob.routes.js";
import applicationRouter from "./routes/application.routes.js";
import recruiterApplicationRouter from "./routes/recruiterApplication.routes.js";
import userRouter from "./routes/user.routes.js";
import savedJobRouter from "./routes/savedJob.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import connectDb from "./config/db.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    next(error);
  }
});
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//Auth Routes
app.use("/api", router);
app.use("/api/auth",authRouter);
//Company Routes
app.use("/api/private/companies", companyRouter);
app.use("/api/public/companies", publicCompanyRouter);
//Recruiter Job Route
app.use("/api/private/job", jobRouter);
//Public Job Route
app.use("/api/public/job", publicJobRoute)
//Aplication Route
app.use("/api/applications", applicationRouter);
//recruiter Applicatoin Route
app.use("/api/private/applications", recruiterApplicationRouter);
//User Profile Routes
app.use("/api/users",userRouter);
//SavedJob Routes
app.use("/api/saved-jobs", savedJobRouter);
//Notification Route
app.use("/api/notifications", notificationRouter);
//Dashboard Route
app.use("/api/dashboard",dashboardRouter);
//404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);
export default app;
