import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import RecruiterDashboardSidebar from "../components/dashboard/RecruiterDashboardSidebar";
import { FadeIn, StaggerContainer } from "../components/motion/Motion";
import Loader from "../components/common/Loader";
import { useEffect } from "react";
import {
  recruiterDashboardFailure,
  recruiterDashboardStart,
  recruiterDashboardSuccess,
} from "../redux/slices/recruiterDashboardSlice";
import { getRecruiterService } from "../service/recruiter/recruiterDashboard.service";
import StatCard from "../components/common/StateCard";
import { Link } from "react-router-dom";

const statusStyles = {
  accepted: "bg-[#e5f3eb] text-[#16734f]",
  pending: "bg-[#fff0d9] text-[#a9651c]",
  rejected: "bg-[#fbe3e0] text-[#c34e42]",
};

const Recruiterdashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const { dashboardData, isLoading, error } = useSelector(
    (state) => state.recruiterDashboard,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchRecruiterDashboard = async () => {
      dispatch(recruiterDashboardStart());
      try {
        const response = await getRecruiterService();
        dispatch(recruiterDashboardSuccess(response.data));
      } catch (error) {
        dispatch(
          recruiterDashboardFailure(error.response?.data?.message) ||
            "Failed to load dashboard.",
        );
      }
    };
    fetchRecruiterDashboard();
  }, [dispatch]);
  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5ed] px-5 text-center font-semibold text-[#c34e42]">
        {error}
      </div>
    );
  if (!dashboardData) return null;

  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <RecruiterDashboardSidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                  Recruiter workspace
                </p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                  Good morning, {firstName}.
                </h1>
                <p className="mt-3 text-sm text-[#69766e]">
                  Here is the hiring pulse across your teams.
                </p>
              </div>
              <Link
                to="/recruiter-jobs/new"
                className="inline-flex items-center gap-2 self-start rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e] sm:self-auto"
              >
                Post a new role <FiArrowUpRight />
              </Link>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              value={dashboardData.totalJobs}
              label="Total Jobs"
              icon={FiBriefcase}
              tone="bg-[#e5f3eb] text-[#16734f]"
            />
            <StatCard
              value={dashboardData.totalActiveJobs}
              label="Total Active Jobs"
              icon={FiTrendingUp}
              tone="bg-[#fff0d9] text-[#a9651c]"
            />
            <StatCard
              value={dashboardData.totalClosedJobs}
              label="Total Closed Jobs"
              icon={FiCheckCircle}
              tone="bg-[#fbe3e0] text-[#c34e42]"
            />
            <StatCard
              value={dashboardData.uniqueApplicants}
              label="Total Unique Applicants"
              icon={FiUsers}
              tone="bg-[#e5f3eb] text-[#16734f]"
            />
          </StaggerContainer>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <FadeIn className="rounded-2xl border border-[#e2e7e1] bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">
                    Pipeline
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">Top applicants</h2>
                </div>
                <FiTrendingUp className="text-[#238457]" size={23} />
              </div>

              <div className="mt-7 divide-y divide-[#edf0ec]">
                {dashboardData.recentApplications?.length ? (
                  dashboardData.recentApplications.map((candidate) => {
                    return (
                      <div
                        key={candidate._id}
                        className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f0e8] text-[#1f7a50]">
                            <FiUsers size={18} />
                          </span>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-[#19221d]">
                              {candidate.applicant.fullName}
                            </h3>
                            <p className="mt-1 truncate text-xs text-[#819087]">
                              {candidate.job.title}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[candidate.status] || statusStyles.pending}`}
                        >
                          {candidate.status}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p>No recent applications yet.</p>
                )}
              </div>
            </FadeIn>

            <FadeIn className="rounded-2xl border border-[#d7e0d8] bg-[#e8f0e8] p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">
                    Hiring health
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">76% filled</h2>
                </div>
                <span className="font-serif text-3xl text-[#1f7a50]">76%</span>
              </div>
              <div className="mt-7 h-2 overflow-hidden rounded-full bg-[#cbdccf]">
                <div
                  className="h-full rounded-full bg-[#1f7a50] transition-[width] duration-700"
                  style={{ width: "76%" }}
                />
              </div>
              <p className="mt-5 text-sm leading-6 text-[#69766e]">
                Your hiring funnel is moving well. Keep the interview cadence
                strong for priority roles.
              </p>
              <a
                href="/recruiter/applicants"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1f7a50] hover:text-[#185e3e]"
              >
                Review applicants <FiArrowUpRight />
              </a>
            </FadeIn>
          </div>

          <FadeIn className="mt-5 rounded-2xl border border-[#e2e7e1] bg-white p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">
                  Live roles
                </p>
                <h2 className="mt-2 font-serif text-3xl">Open requisitions</h2>
              </div>
              <FiClock className="text-[#238457]" size={22} />
            </div>

            {/* <div className="mt-7 grid gap-4 md:grid-cols-3">
              {activeJobs.map((job) => (
                <div key={job.title} className="rounded-2xl border border-[#e2e7e1] bg-[#f8f7f3] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-[#19221d]">{job.title}</h3>
                    <span className="rounded-full bg-[#e5f3eb] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#16734f]">
                      {job.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-[#69766e]">{job.applicants} applicants</p>
                  <button type="button" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1f7a50] hover:text-[#185e3e]">
                    View role <FiArrowUpRight />
                  </button>
                </div>
              ))}
            </div> */}
          </FadeIn>
        </div>
      </main>
    </div>
  );
};

export default Recruiterdashboard;
