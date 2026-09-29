import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiCalendar,
  FiMapPin,
  FiVideo,
} from "react-icons/fi";
import { PiCheckCircle, PiClock, PiXCircle } from "react-icons/pi";
import {
  applicationFailure,
  applicationStart,
  applicationSuccess,
} from "../redux/slices/applicationSlice";
import { getMyApplications } from "../service/application.service";
import showToast from "../utils/toast";
import Loader from "../components/common/Loader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "../components/motion/Motion";

const statusStyles = {
  pending: {
    label: "Pending",
    className: "bg-[#fff0d9] text-[#a9651c]",
    icon: PiClock,
  },
  accepted: {
    label: "Accepted",
    className: "bg-[#e5f3eb] text-[#16734f]",
    icon: PiCheckCircle,
  },
  rejected: {
    label: "Rejected",
    className: "bg-[#fbe3e0] text-[#c34e42]",
    icon: PiXCircle,
  },
};

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Date unavailable";

const formatSalary = (salary) =>
  salary ? `₹${Number(salary).toLocaleString("en-IN")}` : "Salary not listed";

const formatInterviewDateTime = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(date));

const MyApplications = () => {
  const { applications, isLoading } = useSelector((state) => state.application);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchApplications = async () => {
      dispatch(applicationStart());
      try {
        const response = await getMyApplications();
        dispatch(applicationSuccess(response.data || []));
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        dispatch(applicationFailure(errorMsg));
        showToast.error(errorMsg);
      }
    };
    fetchApplications();
  }, [dispatch]);
  if (isLoading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <DashboardSidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                  Your progress
                </p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                  My applications
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#69766e]">
                  Keep track of every opportunity you have put your name forward
                  for.
                </p>
              </div>
              <a
                href="/jobs"
                className="inline-flex items-center gap-2 self-start rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e] sm:self-auto"
              >
                Find more roles <FiArrowUpRight />
              </a>
            </header>
          </FadeIn>

          <StaggerContainer
            className="mt-9 grid gap-3 sm:grid-cols-3"
            aria-label="Application summary"
          >
            {[
              [
                "All applications",
                applications.length,
                FiBriefcase,
                "bg-[#e5f3eb] text-[#16734f]",
              ],
              [
                "Awaiting review",
                applications.filter(({ status }) => status === "pending")
                  .length,
                PiClock,
                "bg-[#fff0d9] text-[#a9651c]",
              ],
              [
                "Positive responses",
                applications.filter(({ status }) => status === "accepted")
                  .length,
                PiCheckCircle,
                "bg-[#e8f0e8] text-[#1f7a50]",
              ],
            ].map(([label, value, Icon, tone]) => (
              <StaggerItem
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-[#e2e7e1] bg-white p-4 shadow-[0_8px_24px_rgba(46,74,57,0.04)] sm:p-5"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
                >
                  <Icon size={19} />
                </span>
                <div>
                  <p className="font-serif text-2xl text-[#19221d]">{value}</p>
                  <p className="text-xs font-bold text-[#819087]">{label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <section className="mt-7">
            {applications.length === 0 ? (
              <FadeIn className="rounded-2xl border border-dashed border-[#cbd9ce] bg-white px-6 py-16 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5f3eb] text-[#1f7a50]">
                  <FiBriefcase size={22} />
                </span>
                <h2 className="mt-5 font-serif text-3xl">
                  Your next move starts here
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#69766e]">
                  You have not applied for any roles yet. Find a position that
                  feels like the right fit.
                </p>
                <a
                  href="/jobs"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white hover:bg-[#185e3e]"
                >
                  Explore open roles <FiArrowUpRight />
                </a>
              </FadeIn>
            ) : (
              <StaggerContainer className="grid gap-4 lg:grid-cols-2">
                {applications.map((application) => {
                  const job = application.job || {};
                  const company = job.company || {};
                  const status =
                    statusStyles[application.status] || statusStyles.pending;
                  const StatusIcon = status.icon;
                  const interview = application.interview;
                  return (
                    <StaggerItem
                      key={application._id}
                      className="rounded-2xl border border-[#e2e7e1] bg-white p-5 shadow-[0_8px_24px_rgba(46,74,57,0.04)] transition-shadow duration-200 hover:shadow-[0_12px_30px_rgba(46,74,57,0.08)] sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f0e8] text-[#1f7a50]">
                            <FiBriefcase size={20} />
                          </span>
                          <div className="min-w-0">
                            <h2 className="truncate font-serif text-2xl text-[#19221d]">
                              {job.title || "Untitled role"}
                            </h2>
                            <p className="mt-1 truncate text-sm font-semibold text-[#69766e]">
                              {company.name || "Company not listed"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
                        >
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </div>
                      <div className="mt-6 grid gap-3 border-t border-[#edf0ec] pt-5 text-sm text-[#69766e] sm:grid-cols-2">
                        <p className="flex items-center gap-2">
                          <FiMapPin className="shrink-0 text-[#238457]" />
                          {job.location || "Location not listed"}
                        </p>
                        <p className="flex items-center gap-2">
                          <FiBriefcase className="shrink-0 text-[#238457]" />
                          {job.jobType || "Job type not listed"}
                        </p>
                        <p className="flex items-center gap-2">
                          <FiCalendar className="shrink-0 text-[#238457]" />
                          Applied {formatDate(application.createdAt)}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="shrink-0 font-bold text-[#238457]">
                            ₹
                          </span>
                          {formatSalary(job.salary)}
                        </p>
                      </div>
                      {interview && (
                        <div className="mt-5 border-t border-[#edf0ec] pt-5">
                          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#238457]"><FiCalendar /> Interview scheduled</p>
                          <p className="mt-2 text-sm font-bold text-[#19221d]">{formatInterviewDateTime(interview.scheduledAt)}</p>
                          <p className="mt-1 text-sm text-[#69766e]">{interview.durationMinutes} minutes · {interview.mode === "online" ? "Online" : "In person"}</p>
                          {interview.mode === "online" ? (
                            <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex max-w-full items-center gap-2 break-all text-sm font-bold text-[#1f7a50] hover:underline"><FiVideo className="shrink-0" /> Join interview</a>
                          ) : (
                            <p className="mt-3 flex items-start gap-2 text-sm text-[#53615a]"><FiMapPin className="mt-0.5 shrink-0 text-[#238457]" />{interview.location}</p>
                          )}
                          {interview.notes && <p className="mt-3 text-sm leading-6 text-[#69766e]">{interview.notes}</p>}
                        </div>
                      )}
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyApplications;
