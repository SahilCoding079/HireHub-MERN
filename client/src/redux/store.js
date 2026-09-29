import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import applicationReducer from "./slices/applicationSlice";
import profileReducer from "./slices/profileSlice"
import jobReducer from "./slices/jobSlice";
import recruiterDashboardReducer from "./slices/recruiterDashboardSlice";
import recruiterJobsReducer from "./slices/recruiterJobsSlice";
import recruiterCompaniesReducer from "./slices/recruiterCompaniesSlice";
import publicCompaniesReducer from "./slices/publicCompaniesSlice";
import savedJobsReducer from "./slices/savedJobsSlice";
import notificationReducer from "./slices/notificationSlice";
import interviewScheduleReducer from "./slices/interviewScheduleSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    application: applicationReducer,
    profile: profileReducer,
    job: jobReducer,
    recruiterDashboard: recruiterDashboardReducer,
    recruiterJobs: recruiterJobsReducer,
    recruiterCompanies: recruiterCompaniesReducer,
    publicCompanies: publicCompaniesReducer,
    savedJobs: savedJobsReducer,
    notifications: notificationReducer,
    interviewSchedule: interviewScheduleReducer,
  },
});

export default store;