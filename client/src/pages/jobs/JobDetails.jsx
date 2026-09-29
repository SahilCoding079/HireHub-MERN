import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiMapPin,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPublicJobById } from "../../service/jobs.service";
import { applyJob } from "../../service/application.service";
import {
  jobDetailFailure,
  jobDetailStart,
  jobDetailSuccess,
} from "../../redux/slices/jobSlice";
import Loader from "../../components/common/Loader";
import { FadeIn } from "../../components/motion/Motion";
import showToast from "../../utils/toast";
import SaveJobButton from "../../components/common/SaveJobButton";

const formatSalary = (salary) =>
  salary ? `₹${Number(salary).toLocaleString("en-IN")}` : "Salary not listed";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isApplying, setIsApplying] = useState(false);
  const {
    selectedJob: job,
    detailLoading: isLoading,
    detailError: error,
  } = useSelector((state) => state.job);

  useEffect(() => {
    const fetchJob = async () => {
      dispatch(jobDetailStart());
      try {
        const response = await getPublicJobById(id);
        dispatch(jobDetailSuccess(response.data));
      } catch (requestError) {
        dispatch(
          jobDetailFailure(
            requestError.response?.data?.message || "Unable to load this job.",
          ),
        );
      }
    };
    fetchJob();
  }, [dispatch, id]);

  const handleApply = async () => {
    if (!isAuthenticated || !user) {
      showToast.error("Please log in to apply for this job.");
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }
    if (user.role !== "user") {
      showToast.error("Only job seekers can apply for jobs.");
      return;
    }

    setIsApplying(true);
    try {
      const response = await applyJob(id);
      showToast.success(response.message || "Application submitted successfully.");
    } catch (requestError) {
      showToast.error(
        requestError.response?.data?.message || "Unable to submit application.",
      );
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error || !job)
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f1f5ed] px-5 text-center">
        <div>
          <p className="font-semibold text-[#c34e42]">
            {error || "Job not found."}
          </p>
          <Link
            to="/jobs"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white"
          >
            <FiArrowLeft /> Back to jobs
          </Link>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#f1f5ed] px-5 pb-16 pt-12 text-[#19221d] sm:px-8 lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#1f7a50] hover:text-[#185e3e]"
        >
          <FiArrowLeft /> Back to all jobs
        </Link>
        <FadeIn className="mt-8">
          <div className="rounded-3xl border border-[#d7e0d8] bg-white p-6 shadow-[0_15px_35px_rgba(46,74,57,0.06)] sm:p-10">
            <div className="flex flex-col justify-between gap-6 border-b border-[#edf0ec] pb-8 sm:flex-row">
              <div>
                <span className="inline-flex rounded-full bg-[#e5f3eb] px-3 py-1.5 text-xs font-bold text-[#16734f]">
                  {job.status || "Open role"}
                </span>
                <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
                  {job.title}
                </h1>
                <p className="mt-3 text-base font-semibold text-[#69766e]">
                  {job.company?.name || "Company not listed"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SaveJobButton jobId={job._id} />
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={isApplying}
                  className="inline-flex h-fit items-center justify-center rounded-xl bg-[#1f7a50] px-5 py-3 text-sm font-bold text-white hover:bg-[#185e3e]"
                >
                  {isApplying ? "Submitting..." : "Apply now"}
                </button>
              </div>
            </div>
            <div className="grid gap-4 border-b border-[#edf0ec] py-7 text-sm text-[#53615a] sm:grid-cols-2 lg:grid-cols-4">
              <span className="flex items-center gap-2">
                <FiMapPin className="text-[#238457]" />
                {job.location}
              </span>
              <span className="flex items-center gap-2">
                <FiBriefcase className="text-[#238457]" />
                {job.jobType}
              </span>
              <span className="flex items-center gap-2">
                <FiCalendar className="text-[#238457]" />
                {job.experienceLevel}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-[#238457]">₹</span>
                {formatSalary(job.salary)}
              </span>
            </div>
            <div className="grid gap-10 pt-8 lg:grid-cols-[1.35fr_0.65fr]">
              <article>
                <h2 className="font-serif text-3xl">About the role</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#69766e]">
                  {job.description}
                </p>
                {job.requirements?.length > 0 && (
                  <>
                    <h2 className="mt-10 font-serif text-3xl">
                      What you&apos;ll bring
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {job.requirements.map((requirement) => (
                        <li
                          key={requirement}
                          className="flex gap-3 text-sm leading-6 text-[#69766e]"
                        >
                          <FiCheck className="mt-1 shrink-0 text-[#238457]" />
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </article>
              <aside className="h-fit rounded-2xl bg-[#e8f0e8] p-6">
                <h2 className="font-serif text-2xl">
                  About {job.company?.name || "the company"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#69766e]">
                  {job.company?.description ||
                    "Learn more about this team and the work they are building."}
                </p>
                {job.company?.location && (
                  <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#53615a]">
                    <FiMapPin className="text-[#238457]" />
                    {job.company.location}
                  </p>
                )}
              </aside>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
};

export default JobDetails;
