import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import RecruiterDashboardSidebar from "../../components/dashboard/RecruiterDashboardSidebar";
import { FadeIn } from "../../components/motion/Motion";
import {
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiUsers
} from "react-icons/fi";
import { TfiPencilAlt } from "react-icons/tfi";
import { GoLinkExternal } from "react-icons/go";
import {
  recruiterJobMutationFailure,
  recruiterJobMutationStart,
  recruiterJobRemoved,
  recruiterJobMutationSuccess,
  recruiterJobsAppendSuccess,
  recruiterJobsFailure,
  recruiterJobsStart,
  recruiterJobsSuccess,
} from "../../redux/slices/recruiterJobsSlice";
import {
  deleteRecruiterJob,
  getRecruiterJobs,
} from "../../service/recruiter/recruiterJobs.service";
import Loader from "../../components/common/Loader";
import ConfirmModal from "../../components/ui/ConfirmModal";
import showToast from "../../utils/toast";

const statusStyles = {
  active: "bg-[#e5f3eb] text-[#16734f]",
  closed: "bg-[#fbe3e0] text-[#c34e42]",
  draft: "bg-[#fff0d9] text-[#a9651c]",
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const formatSalary = (salary) => {
  if (salary == null) return "Salary not listed";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(salary);
};

const RecruiterJobs = () => {
  const dispatch = useDispatch();
  const {
    jobs,
    pagination,
    isLoading,
    mutationLoading,
    error,
  } = useSelector((state) => state.recruiterJobs);
  const [jobToDelete, setJobToDelete] = useState(null);
  const remainingJobs = Math.max(0, (pagination?.totalJobs || 0) - jobs.length);

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(recruiterJobsStart());
      try {
        const response = await getRecruiterJobs({ page: 1, limit: 10 });
        dispatch(recruiterJobsSuccess(response));
      } catch (requestError) {
        dispatch(
          recruiterJobsFailure(
            requestError.response?.data?.message || "Unable to load your jobs.",
          ),
        );
      }
    };

    fetchJobs();
  }, [dispatch]);

  const loadMoreJobs = async (event) => {
    event?.preventDefault();
    const nextPage = (pagination?.currentPage || 1) + 1;
    dispatch(recruiterJobsStart());
    try {
      const response = await getRecruiterJobs({ page: nextPage, limit: 10 });
      dispatch(recruiterJobsAppendSuccess(response));
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to load more jobs."
      dispatch(recruiterJobsFailure(message));
      showToast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    dispatch(recruiterJobMutationStart());
    try {
      const response = await deleteRecruiterJob(jobToDelete);
      dispatch(recruiterJobMutationSuccess());
      dispatch(recruiterJobRemoved(jobToDelete));
      setJobToDelete(null);
      showToast.success(response.message || "Job deleted successfully.");
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to delete this job."
      dispatch(
        recruiterJobMutationFailure(message));
      showToast.error(requestError.response?.data?.message || "Unable to delete this job.");
    }
  };

  if (isLoading && !jobs.length) return <Loader />;

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <RecruiterDashboardSidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="flex flex-col justify-between gap-6 border-b border-[#dfe8df] pb-8 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">Recruiter workspace</p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Your job board.</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#69766e]">
                  Keep every role, hiring stage, and opening in one clear view.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-[#d7e0d8] bg-white px-4 py-3 text-right shadow-[0_8px_22px_rgba(31,67,46,0.04)]">
                  <p className="text-2xl font-bold text-[#1f7a50]">{pagination?.totalJobs || 0}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#819087]">Total roles</p>
                </div>
                  <Link to="/recruiter-jobs/new" className="inline-flex items-center gap-2 rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e]">
                  <FiPlus size={17} /> Add role
                </Link>
              </div>
            </div>
          </FadeIn>

          {error && !jobs.length ? (
            <div className="mt-8 rounded-2xl border border-[#f1c7c2] bg-[#fff6f4] p-6 text-sm font-semibold text-[#c34e42]" role="alert">
              {error}
            </div>
          ) : jobs.length ? (
            <>
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                {jobs.map((job) => (
                  <div key={job._id}>
                    <article className="group h-full rounded-2xl border border-[#dfe8df] bg-white p-5 shadow-[0_10px_28px_rgba(31,67,46,0.04)] transition hover:-translate-y-0.5 hover:border-[#b8d4c2] hover:shadow-[0_14px_32px_rgba(31,67,46,0.08)] sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          {job.company?.logo ? (
                            <img src={job.company.logo} alt="" className="h-12 w-12 shrink-0 rounded-xl border border-[#e5ebe5] object-contain p-1.5" />
                          ) : (
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5f3eb] text-[#1f7a50]"><FiBriefcase size={21} /></span>
                          )}
                          <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold text-[#19221d]">{job.title}</h2>
                            <p className="mt-1 truncate text-sm text-[#69766e]">{job.company?.name || "Company not listed"}</p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] ${statusStyles[job.status] || statusStyles.draft}`}>
                            {job.status || "draft"}
                          </span>
                          <Link
                          title="View job Detail"
                            to={`/recruiter-job-detail/${job._id}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#cbd9ce] text-[#1f7a50] transition hover:bg-[#e5f3eb]"
                            aria-label={`Edit ${job.title}`}
                          >
                            <GoLinkExternal size={15} />
                          </Link>
                          <Link
                          title="Edit Job"
                            to={`/recruiter-jobs/${job._id}/edit`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#cbd9ce] text-[#1f7a50] transition hover:bg-[#e5f3eb]"
                            aria-label={`Edit ${job.title}`}
                          >
                            <TfiPencilAlt size={15} />
                          </Link>
                          <button
                          title="Delete Job"
                            type="button"
                            onClick={() => setJobToDelete(job._id)}
                            disabled={mutationLoading}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#f1c7c2] text-[#c34e42] transition hover:bg-[#fff6f4] disabled:cursor-wait disabled:opacity-50 cursor-pointer"
                            aria-label={`Delete ${job.title}`}
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3 border-y border-[#edf0ec] py-4 text-sm text-[#69766e] sm:grid-cols-4">
                        <span className="flex items-center gap-2"><FiMapPin className="shrink-0 text-[#238457]" />{job.location || "Remote"}</span>
                        <span className="flex items-center gap-2"><FiClock className="shrink-0 text-[#238457]" />{job.jobType || "Flexible"}</span>
                        <span className="flex items-center gap-2"><FiUsers className="shrink-0 text-[#238457]" />{job.position || 0} openings</span>
                        <span className="flex items-center gap-2"><FiCalendar className="shrink-0 text-[#238457]" />Created {formatDate(job.createdAt)}</span>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-bold text-[#1f7a50]">{formatSalary(job.salary)}</p>
                        <span className="text-right text-xs font-semibold text-[#819087]">{job.experienceLevel || "Experience flexible"}<br />Updated {formatDate(job.updatedAt)}</span>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {pagination?.currentPage < pagination?.totalPages && (
                <div className="mt-8 flex justify-center border-t border-[#dfe8df] pt-6">
                  <button
                    type="button"
                    onClick={loadMoreJobs}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-xl border border-[#b8d4c2] bg-[#1f7a50] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#e5f3eb] hover:text-[#1f7a50] disabled:cursor-wait disabled:opacity-60 duration-300 cursor-pointer"
                  >
                    {isLoading
                      ? `Loading jobs... (${remainingJobs} remaining)`
                      : `Load more jobs (${remainingJobs} remaining)`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#b8d4c2] bg-white px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5f3eb] text-[#1f7a50]"><FiBriefcase size={24} /></span>
              <h2 className="mt-5 font-serif text-3xl">No roles yet.</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#69766e]">Your published and draft roles will appear here once you create your first opening.</p>
              <Link to="/recruiter-jobs/new" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e]"><FiPlus size={17} /> Create your first role</Link>
            </div>
          )}
        </div>
      </main>
      <ConfirmModal
        isOpen={Boolean(jobToDelete)}
        title="Delete this role?"
        message="This action cannot be undone and will remove the role from your job board."
        isLoading={mutationLoading}
        onCancel={() => setJobToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default RecruiterJobs;