import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiClock,
  FiEdit2,
  FiMapPin,
  FiUsers,
  FiX,
} from "react-icons/fi";
import RecruiterDashboardSidebar from "../../components/dashboard/RecruiterDashboardSidebar";
import Loader from "../../components/common/Loader";
import showToast from "../../utils/toast";
import {
  recruiterApplicantStatusSuccess,
  recruiterApplicantsFailure,
  recruiterApplicantsStart,
  recruiterApplicantsSuccess,
  recruiterJobDetailFailure,
  recruiterJobDetailStart,
  recruiterJobDetailSuccess,
  recruiterJobMutationFailure,
  recruiterJobMutationStart,
  recruiterJobMutationSuccess,
} from "../../redux/slices/recruiterJobsSlice";
import {
  getAllApplicants,
  getRecruiterJob,
  updateApplicantStatus,
} from "../../service/recruiter/recruiterJobs.service";

const statusStyles = {
  active: "bg-[#e5f3eb] text-[#16734f]",
  closed: "bg-[#fbe3e0] text-[#c34e42]",
  draft: "bg-[#fff0d9] text-[#a9651c]",
};

const applicationStatusStyles = {
  pending: "bg-[#fff0d9] text-[#a9651c]",
  accepted: "bg-[#e5f3eb] text-[#16734f]",
  rejected: "bg-[#fbe3e0] text-[#c34e42]",
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

const RecruiterJobDetail = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    selectedJob,
    detailLoading,
    detailError,
    applicants,
    applicantsLoading,
    applicantsError,
    mutationLoading,
  } = useSelector((state) => state.recruiterJobs);
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null);

  useEffect(() => {
    const loadJobDetails = async () => {
      dispatch(recruiterJobDetailStart());
      try {
        const response = await getRecruiterJob(jobId);
        dispatch(recruiterJobDetailSuccess(response));
      } catch (requestError) {
        const message = requestError.response?.data?.message || "Unable to fetch this job details.";
        showToast.error(message);
        dispatch(recruiterJobDetailFailure(message));
      }
    };

    const loadApplicants = async () => {
      dispatch(recruiterApplicantsStart());
      try {
        dispatch(recruiterApplicantsSuccess(await getAllApplicants(jobId)));
      } catch (requestError) {
        const message = requestError.response?.data?.message || "Unable to fetch applicants.";
        showToast.error(message);
        dispatch(recruiterApplicantsFailure(message));
      }
    };

    if (jobId) {
      loadJobDetails();
      loadApplicants();
    }
  }, [dispatch, jobId]);

  const handleStatusUpdate = async (applicationId, status) => {
    setUpdatingApplicationId(applicationId);
    dispatch(recruiterJobMutationStart());
    try {
      const response = await updateApplicantStatus(applicationId, status);
      dispatch(recruiterApplicantStatusSuccess(response));
      dispatch(recruiterJobMutationSuccess());
      showToast.success(response.message || "Applicant status updated.");
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to update applicant status.";
      dispatch(recruiterJobMutationFailure(message));
      showToast.error(message);
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  if (detailLoading && !selectedJob) return <Loader />;

  if (detailError || !selectedJob) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f5ed] px-5">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold text-[#c34e42]">{detailError || "Job not found."}</p>
          <Link to="/recruiter-jobs" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1f7a50]">
            <FiArrowLeft /> Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  const pendingApplicants = applicants.filter((application) => !application.status || application.status === "pending").length;

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <RecruiterDashboardSidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/recruiter-jobs")}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#69766e] transition hover:text-[#1f7a50]"
            >
              <FiArrowLeft /> Back to jobs
            </button>
            <Link
              to={`/recruiter-jobs/${jobId}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e]"
            >
              <FiEdit2 /> Edit role
            </Link>
          </div>

          <section className="mt-7 rounded-2xl border border-[#dfe8df] bg-white p-6 shadow-[0_10px_28px_rgba(31,67,46,0.04)] sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div className="flex min-w-0 items-start gap-4">
                {selectedJob.company?.logo ? (
                  <img src={selectedJob.company.logo} alt="" className="h-14 w-14 shrink-0 rounded-xl border border-[#e5ebe5] object-contain p-1.5" />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e5f3eb] text-[#1f7a50]"><FiBriefcase size={24} /></span>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">Recruiter workspace</p>
                  <h1 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">{selectedJob.title}</h1>
                  <p className="mt-2 text-sm text-[#69766e]">{selectedJob.company?.name || "Company not listed"}</p>
                </div>
              </div>
              <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] ${statusStyles[selectedJob.status] || statusStyles.draft}`}>
                {selectedJob.status || "draft"}
              </span>
            </div>

            <div className="mt-7 grid gap-3 border-y border-[#edf0ec] py-5 text-sm text-[#69766e] sm:grid-cols-2 lg:grid-cols-4">
              <span className="flex items-center gap-2"><FiMapPin className="text-[#238457]" />{selectedJob.location || "Remote"}</span>
              <span className="flex items-center gap-2"><FiClock className="text-[#238457]" />{selectedJob.jobType || "Flexible"}</span>
              <span className="flex items-center gap-2"><FiUsers className="text-[#238457]" />{selectedJob.position || 0} openings</span>
              <span className="flex items-center gap-2"><FiCalendar className="text-[#238457]" />Created {formatDate(selectedJob.createdAt)}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <span className="font-bold text-[#1f7a50]">{formatSalary(selectedJob.salary)}</span>
              <span className="text-[#69766e]">{selectedJob.experienceLevel || "Experience flexible"}</span>
              <span className="text-[#819087]">Updated {formatDate(selectedJob.updatedAt)}</span>
            </div>
          </section>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-2xl border border-[#dfe8df] bg-white p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">Role brief</p>
              <h2 className="mt-2 font-serif text-3xl">What this role does</h2>
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#69766e]">{selectedJob.description}</p>
              <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.12em] text-[#53615a]">Requirements</h3>
              <ul className="mt-4 space-y-3">
                {selectedJob.requirements?.map((requirement) => (
                  <li key={requirement} className="flex items-start gap-3 text-sm leading-6 text-[#69766e]"><FiCheck className="mt-1 shrink-0 text-[#238457]" />{requirement}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-[#dfe8df] bg-[#e8f0e8] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">Hiring pulse</p>
              <h2 className="mt-2 font-serif text-3xl">{applicants.length} applicants</h2>
              <p className="mt-2 text-sm leading-6 text-[#69766e]">{pendingApplicants} still need a decision for this role.</p>
              <div className="mt-7 h-2 overflow-hidden rounded-full bg-[#cbdccf]"><div className="h-full rounded-full bg-[#1f7a50]" style={{ width: applicants.length ? `${((applicants.length - pendingApplicants) / applicants.length) * 100}%` : "0%" }} /></div>
            </section>
          </div>

          <section className="mt-5 rounded-2xl border border-[#dfe8df] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#edf0ec] pb-5">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">Candidate pipeline</p><h2 className="mt-2 font-serif text-3xl">Applicants for this role</h2></div>
              <span className="text-sm font-semibold text-[#819087]">{applicants.length} total</span>
            </div>
            {applicantsError ? <p className="mt-6 text-sm font-semibold text-[#c34e42]">{applicantsError}</p> : applicantsLoading ? <Loader inline /> : applicants.length ? (
              <div className="divide-y divide-[#edf0ec]">
                {applicants.map((application) => {
                  const applicationStatus = application.status || "pending";
                  const isUpdating = updatingApplicationId === application._id || mutationLoading;
                  return (
                    <div key={application._id} className="flex flex-col gap-4 py-5 first:pb-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        {application.applicant?.profilePhoto ? <img src={application.applicant.profilePhoto} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e5f3eb] font-bold text-[#1f7a50]">{application.applicant?.fullName?.charAt(0)?.toUpperCase() || "A"}</span>}
                        <div className="min-w-0"><p className="truncate font-bold text-[#19221d]">{application.applicant?.fullName || "Applicant"}</p><p className="truncate text-sm text-[#69766e]">{application.applicant?.email || "Email unavailable"}</p></div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${applicationStatusStyles[applicationStatus] || applicationStatusStyles.pending}`}>{applicationStatus}</span>
                        {applicationStatus !== "accepted" && <button type="button" onClick={() => handleStatusUpdate(application._id, "accepted")} disabled={isUpdating} className="inline-flex items-center gap-1.5 rounded-lg border border-[#b8d4c2] px-3 py-2 text-xs font-bold text-[#16734f] hover:bg-[#e5f3eb] disabled:opacity-50"><FiCheck /> Accept</button>}
                        {applicationStatus !== "rejected" && <button type="button" onClick={() => handleStatusUpdate(application._id, "rejected")} disabled={isUpdating} className="inline-flex items-center gap-1.5 rounded-lg border border-[#f1c7c2] px-3 py-2 text-xs font-bold text-[#c34e42] hover:bg-[#fff6f4] disabled:opacity-50"><FiX /> Reject</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <div className="py-12 text-center text-sm text-[#69766e]"><FiUsers className="mx-auto text-[#1f7a50]" size={28} /><p className="mt-3">No applicants for this role yet.</p></div>}
          </section>
        </div>
      </main>
    </div>
  );
};

export default RecruiterJobDetail