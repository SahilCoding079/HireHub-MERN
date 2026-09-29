import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiTrendingUp,
} from "react-icons/fi";
import { PiCheckCircle, PiXCircle } from "react-icons/pi";
import {
  dashboardFailure,
  dashboardStart,
  dashboardSuccess,
} from "../redux/slices/userSlice";
import { getUserDashboard } from "../service/user.service";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { FadeIn, StaggerContainer } from "../components/motion/Motion";
import Loader from "../components/common/Loader";
import StatCard from "../components/common/StateCard";

const statusStyles = {
  pending: "bg-[#fff0d9] text-[#a9651c]",
  accepted: "bg-[#e5f3eb] text-[#16734f]",
  rejected: "bg-[#fbe3e0] text-[#c34e42]",
};

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, isLoading, error } = useSelector((state) => state.user);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUserDashboard = async () => {
      dispatch(dashboardStart());
      try {
        const response = await getUserDashboard();
        dispatch(dashboardSuccess(response.data));
      } catch (requestError) {
        dispatch(
          dashboardFailure(
            requestError.response?.data?.message || "Failed to load dashboard.",
          ),
        );
      }
    };
    fetchUserDashboard();
  }, [dispatch]);

  if (isLoading)
    return (
      <>
        <Loader />
      </>
    );
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5ed] px-5 text-center font-semibold text-[#c34e42]">
        {error}
      </div>
    );
  if (!dashboard) return null;

  const profileFields = [
    user?.fullName,
    user?.email,
    user?.bio,
    user?.resume,
    user?.skills?.length,
  ];
  const profileProgress = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100,
  );
  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <DashboardSidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                  Your workspace
                </p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                  Good morning, {firstName}.
                </h1>
                <p className="mt-3 text-sm text-[#69766e]">
                  Here is the pulse of your job search.
                </p>
              </div>
              <a
                href="/jobs"
                className="inline-flex items-center gap-2 self-start rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e] sm:self-auto"
              >
                Find a new role <FiArrowUpRight />
              </a>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total applications"
              value={dashboard.totalApplications || 0}
              icon={FiBriefcase}
              tone="bg-[#e5f3eb] text-[#16734f]"
            />
            <StatCard
              label="Pending review"
              value={dashboard.pendingApplications || 0}
              icon={FiClock}
              tone="bg-[#fff0d9] text-[#a9651c]"
            />
            <StatCard
              label="Accepted"
              value={dashboard.acceptedApplications || 0}
              icon={PiCheckCircle}
              tone="bg-[#e5f3eb] text-[#16734f]"
            />
            <StatCard
              label="Rejected"
              value={dashboard.rejectedApplications || 0}
              icon={PiXCircle}
              tone="bg-[#fbe3e0] text-[#c34e42]"
            />
          </StaggerContainer>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <FadeIn className="rounded-2xl border border-[#e2e7e1] bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">
                    Latest activity
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">
                    Recent applications
                  </h2>
                </div>
                <FiTrendingUp className="text-[#238457]" size={23} />
              </div>
              <div className="mt-7 divide-y divide-[#edf0ec]">
                {dashboard.recentApplications?.length ? (
                  dashboard.recentApplications.map((application) => {
                    const job = application.job || {};
                    const company = job.company || {};
                    const status = application.status || "pending";
                    return (
                      <div
                        key={application._id}
                        className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f0e8] text-[#1f7a50]">
                            <FiBriefcase size={18} />
                          </span>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-[#19221d]">
                              {job.title || "Untitled role"}
                            </h3>
                            <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#819087]">
                              <FiMapPin size={12} /> {company.name || "Company"}{" "}
                              {job.location ? `· ${job.location}` : ""}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[status] || statusStyles.pending}`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-5 text-sm text-[#819087]">
                    Your submitted applications will appear here.
                  </p>
                )}
              </div>
            </FadeIn>
            <FadeIn className="rounded-2xl border border-[#d7e0d8] bg-[#e8f0e8] p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">
                    Profile strength
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">
                    {profileProgress}% ready
                  </h2>
                </div>
                <span className="font-serif text-3xl text-[#1f7a50]">
                  {profileProgress}%
                </span>
              </div>
              <div className="mt-7 h-2 overflow-hidden rounded-full bg-[#cbdccf]">
                <div
                  className="h-full rounded-full bg-[#1f7a50] transition-[width] duration-700"
                  style={{ width: `${profileProgress}%` }}
                />
              </div>
              <p className="mt-5 text-sm leading-6 text-[#69766e]">
                A complete profile helps the right teams understand what makes
                you different.
              </p>
              <a
                href="/profile"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1f7a50] hover:text-[#185e3e]"
              >
                Complete profile <FiArrowUpRight />
              </a>
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
