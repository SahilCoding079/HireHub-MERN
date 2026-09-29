import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/common/Loader";
import ProtectedRoutes from "./ProtectedRoutes";

const Home = lazy(() => import("../pages/home/Home"));
const About = lazy(() => import("../pages/about/About"));
const UserDashboard = lazy(() => import("../dashboard/UserDashboard"));
const MyApplications = lazy(() => import("../application/MyApplications"));
const SavedJobs = lazy(() => import("../application/SavedJobs"));
const Notifications = lazy(() => import("../pages/notifications/Notifications"));
const Jobs = lazy(() => import("../pages/jobs/Jobs"));
const JobDetails = lazy(() => import("../pages/jobs/JobDetails"));
const UserProfile = lazy(() => import("../pages/profile/UserProfile"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword"));
const NotFound = lazy(() => import("../pages/notfound/NotFound"));

const Recruiterdashboard = lazy(
  () => import("../dashboard/Recruiterdashboard"),
);
const RecruiterJobs = lazy(
  () => import("../recruiter/recruiterJobs/RecruiterJobs"),
);
const RecruiterJobDetail = lazy(() => import("../recruiter/recruiterJobs/RecruiterJobDetail"));
const CreateJob = lazy(() => import("../recruiter/recruiterJobs/CreateJob"));
const RecruiterCompanies = lazy(
  () => import("../recruiter/companies/RecruiterCompanies"),
);
const RecruiterApplicants = lazy(
  () => import("../recruiter/applicants/RecruiterApplicants"),
);
const RecruiterApplicantDetail = lazy(
  () => import("../recruiter/applicants/RecruiterApplicantDetail"),
);

const AppRouter = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="route-transition">
      <Suspense fallback={<Loader />}>
        <Routes location={location}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/find-job" element={<Jobs />} />
          </Route>
          <Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
          <Route element={<ProtectedRoutes allowedRoles={["user"]} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/user-profile" element={<UserProfile />} />
          </Route>
          <Route element={<ProtectedRoutes allowedRoles={["user", "recruiter"]} />}>
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route element={<ProtectedRoutes allowedRoles={["recruiter"]} />}>
            <Route
              path="/recruiter-dashboard"
              element={<Recruiterdashboard />}
            />
            <Route path="/recruiter-companies" element={<RecruiterCompanies />} />
            <Route path="/recruiter-applicants" element={<RecruiterApplicants />} />
            <Route path="/recruiter-applicants/:id" element={<RecruiterApplicantDetail />} />
            <Route path="/recruiter-profile" element={<Recruiterdashboard />} />
            <Route path="/recruiter-jobs" element={<RecruiterJobs />} />
            <Route path="/recruiter-jobs/:id/edit" element={<CreateJob />} />
            <Route path="/recruiter-job-detail/:id" element={<RecruiterJobDetail />} />
          </Route>
          <Route element={<ProtectedRoutes allowedRoles={["recruiter"]} />}>
            <Route path="/recruiter-jobs/new" element={<CreateJob />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRouter;
