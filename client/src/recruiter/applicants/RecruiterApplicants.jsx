import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiEye, FiUsers, FiX } from "react-icons/fi";
import RecruiterDashboardSidebar from "../../components/dashboard/RecruiterDashboardSidebar";
import Loader from "../../components/common/Loader";
import {
  recruiterApplicantStatusSuccess,
  recruiterApplicantsFailure,
  recruiterApplicantsStart,
  recruiterApplicantsSuccess,
  recruiterJobMutationFailure,
  recruiterJobMutationStart,
  recruiterJobMutationSuccess,
} from "../../redux/slices/recruiterJobsSlice";
import {
  getAllApplicants,
  getRecruiterJobs,
  updateApplicantStatus,
} from "../../service/recruiter/recruiterJobs.service";
import showToast from "../../utils/toast";

const RecruiterApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null);
  const dispatch = useDispatch();
  const { applicants, applicantsLoading, applicantsError, mutationLoading } =
    useSelector((state) => state.recruiterJobs);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await getRecruiterJobs({ page: 1, limit: 100 });
        setJobs(response.data || []);
      } catch (requestError) {
        showToast.error(
          requestError.response?.data?.message || "Unable to load jobs.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const statusStyles = {
    pending: "bg-[#fff0d9] text-[#a9651c]",
    accepted: "bg-[#e5f3eb] text-[#16734f]",
    rejected: "bg-[#fbe3e0] text-[#c34e42]",
  };
  const handleJobChange = async (event) => {
    const jobId = event.target.value;
    setSelectedJobId(jobId);
    if (!jobId) return dispatch(recruiterApplicantsSuccess({ data: [] }));

    dispatch(recruiterApplicantsStart());
    try {
      dispatch(recruiterApplicantsSuccess(await getAllApplicants(jobId)));
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to load applicants.";
      dispatch(recruiterApplicantsFailure(message));
      showToast.error(message);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    setUpdatingApplicationId(applicationId);
    dispatch(recruiterJobMutationStart());
    try {
      dispatch(recruiterApplicantStatusSuccess(await updateApplicantStatus(applicationId, status)));
      dispatch(recruiterJobMutationSuccess());
      showToast.success("Application status updated.");
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to update applicant status.";
      dispatch(recruiterJobMutationFailure(message));
      showToast.error(message);
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <RecruiterDashboardSidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/recruiter-dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#69766e] hover:text-[#1f7a50]"
          >
            <FiArrowLeft /> Back to dashboard
          </Link>
          <div className="mt-7 border-b border-[#dfe8df] pb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
              Recruiter workspace
            </p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
              Applicants.
            </h1>
            <p className="mt-3 text-sm text-[#69766e]">
              Review candidates for each of your roles.
            </p>
          </div>

          <section className="mt-8 rounded-2xl border border-[#dfe8df] bg-white p-5 shadow-[0_10px_28px_rgba(31,67,46,0.04)] sm:p-7">
            <label className="flex max-w-xl flex-col text-sm font-bold text-[#53615a]">
              Select a job
              <select
                value={selectedJobId}
                onChange={handleJobChange}
                className="mt-2 w-full rounded-xl border border-[#d7e0d8] bg-[#fbfcfa] px-4 py-3 text-sm text-[#19221d] outline-none focus:border-[#238457] focus:ring-2 focus:ring-[#e5f3eb]"
              >
                <option value="">Choose a role</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="mt-5 rounded-2xl border border-[#dfe8df] bg-white p-5 sm:p-7">
            {applicantsError ? (
              <p className="text-sm font-semibold text-[#c34e42]">{applicantsError}</p>
            ) : applicantsLoading ? (
              <Loader inline />
            ) : applicants.length ? (
              <div className="divide-y divide-[#edf0ec]">
                {applicants.map((application) => (
                    <div
                    key={application._id}
                    className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                      <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f3eb] text-[#1f7a50]">
                        <FiUsers />
                      </span>
                      <div>
                        <p className="font-bold">
                          {application.applicant?.fullName || "Applicant"}
                        </p>
                        <p className="truncate text-sm text-[#69766e]">
                          {application.applicant?.email || "Email unavailable"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[application.status] || statusStyles.pending}`}>
                        {application.status || "pending"}
                      </span>
                      <Link to={`/recruiter-applicants/${application._id}`} aria-label={`View ${application.applicant?.fullName || "applicant"}`} title="View applicant" className="inline-flex items-center gap-1.5 rounded-lg border border-[#d7e0d8] px-3 py-2 text-xs font-bold text-[#53615a] hover:bg-[#f1f5ed]"><FiEye /> View applicant</Link>
                      {[
                        ["accepted", FiCheck, "Accept", "border-[#b8d4c2] text-[#16734f] hover:bg-[#e5f3eb]"],
                        ["rejected", FiX, "Reject", "border-[#f1c7c2] text-[#c34e42] hover:bg-[#fff6f4]"],
                        ["pending", FiUsers, "Pending", "border-[#ead3a6] text-[#a9651c] hover:bg-[#fff0d9]"],
                      ].map(([status, Icon, label, tone]) => (
                        <button key={status} type="button" onClick={() => handleStatusUpdate(application._id, status)} disabled={mutationLoading || updatingApplicationId === application._id || application.status === status} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${tone}`}>
                          <Icon /> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-[#69766e]">
                <FiUsers className="mx-auto text-[#1f7a50]" size={28} />
                <p className="mt-3">
                  {selectedJobId
                    ? "No applicants for this role yet."
                    : "Select a role to review applicants."}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default RecruiterApplicants;
