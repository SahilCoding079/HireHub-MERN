import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiFileText,
  FiSend,
  FiUsers,
} from "react-icons/fi";
import RecruiterDashboardSidebar from "../../components/dashboard/RecruiterDashboardSidebar";
import { FadeIn } from "../../components/motion/Motion";
import Input from "../../components/ui/Input";
import { jobFormDefaults, jobSchema } from "../../validations/JobSchema";
import {
  recruiterJobDetailFailure,
  recruiterJobDetailStart,
  recruiterJobDetailSuccess,
  recruiterJobMutationFailure,
  recruiterJobMutationStart,
  recruiterJobMutationSuccess,
} from "../../redux/slices/recruiterJobsSlice";
import {
  createRecruiterJob,
  getRecruiterJob,
  updateRecruiterJob,
} from "../../service/recruiter/recruiterJobs.service";
import { getRecruiterCompanies } from "../../service/recruiter/recruiterCompanies.service";
import showToast from "../../utils/toast";

const steps = [
  {
    title: "Role basics",
    description: "Set the role and where it belongs.",
    icon: FiBriefcase,
    fields: ["title", "company", "location", "jobType"],
  },
  {
    title: "Role details",
    description: "Help candidates understand the opportunity.",
    icon: FiFileText,
    fields: ["description", "requirements"],
  },
  {
    title: "Hiring plan",
    description: "Add the practical details for your team.",
    icon: FiUsers,
    fields: ["salary", "experienceLevel", "position"],
  },
];

const inputClass =
  "mt-2 w-full rounded-xl border border-[#d7e0d8] bg-[#fbfcfa] px-4 py-3 text-sm text-[#19221d] outline-none transition placeholder:text-[#a0aaa2] focus:border-[#238457] focus:ring-2 focus:ring-[#e5f3eb]";

const FieldError = ({ error }) =>
  error ? <p className="mt-1.5 text-xs font-semibold text-[#c34e42]">{error.message}</p> : null;

const CreateJob = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: jobId } = useParams();
  const isEditing = Boolean(jobId);
  const { mutationLoading, detailLoading } = useSelector(
    (state) => state.recruiterJobs,
  );
  const [step, setStep] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState(null);
  const {
    register,
    trigger,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: jobFormDefaults,
    mode: "onTouched",
  });

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await getRecruiterCompanies();
        setCompanies(response.data || []);
      } catch (requestError) {
        setCompaniesError(
          requestError.response?.data?.message || "Unable to load companies.",
        );
      } finally {
        setCompaniesLoading(false);
      }
    };

    loadCompanies();
  }, []);

  useEffect(() => {
    if (!jobId) return undefined;

    const loadJob = async () => {
      dispatch(recruiterJobDetailStart());
      try {
        const response = await getRecruiterJob(jobId);
        const job = response.data;
        reset({
          title: job.title || "",
          company: job.company?.name || "",
          location: job.location || "",
          jobType: job.jobType || "",
          description: job.description || "",
          requirements: Array.isArray(job.requirements)
            ? job.requirements.join("\n")
            : "",
          salary: job.salary ?? "",
          experienceLevel: job.experienceLevel || "",
          position: job.position ?? 1,
          status: job.status || "active",
        });
        dispatch(recruiterJobDetailSuccess(response));
      } catch (requestError) {
        dispatch(
          recruiterJobDetailFailure(
            requestError.response?.data?.message || "Unable to load this job.",
          ),
        );
        showToast.error(
          requestError.response?.data?.message || "Unable to load this job.",
        );
      }
    };

    loadJob();
    return undefined;
  }, [dispatch, jobId, reset]);

  const goNext = async () => {
    if (await trigger(steps[step].fields)) {
      setStep((currentStep) => Math.min(currentStep + 1, steps.length - 1));
    }
  };

  const onSubmit = async (values) => {
    const company = companies.find(
      (item) => item.name.toLowerCase() === values.company.trim().toLowerCase(),
    );
    if (!company) {
      showToast.error("Enter the name of one of your registered companies.");
      return;
    }

    const payload = {
      ...values,
      company: company._id,
      requirements: values.requirements
        .split(/\r?\n/)
        .map((requirement) => requirement.trim())
        .filter(Boolean),
    };

    dispatch(recruiterJobMutationStart());
    try {
      const response = isEditing
        ? await updateRecruiterJob(jobId, payload)
        : await createRecruiterJob(payload);
      dispatch(recruiterJobMutationSuccess());
      showToast.success(
        response.message ||
          (isEditing ? "Job updated successfully." : "Job created successfully."),
      );
      navigate("/recruiter-jobs");
    } catch (requestError) {
      dispatch(
        recruiterJobMutationFailure(
          requestError.response?.data?.message || "Unable to save this job.",
        ),
      );
      showToast.error(
        requestError.response?.data?.message || "Unable to save this job.",
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <RecruiterDashboardSidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <button
              type="button"
              onClick={() => navigate("/recruiter-jobs")}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#69766e] transition hover:text-[#1f7a50]"
            >
              <FiArrowLeft /> Back to jobs
            </button>
            <div className="mt-7 flex flex-col justify-between gap-5 border-b border-[#dfe8df] pb-8 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                  Recruiter workspace
                </p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                  Create a new role.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#69766e]">
                  Build a clear, compelling opening in a few focused steps.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm font-bold text-[#1f7a50]">
                  Step {step + 1} of {steps.length}
                </p>
                <p className="mt-1 text-xs text-[#819087]">
                  {Math.round(((step + 1) / steps.length) * 100)}% complete
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="mt-8 rounded-2xl border border-[#dfe8df] bg-white p-5 shadow-[0_10px_28px_rgba(31,67,46,0.04)] sm:p-8">
            <div className="mb-8">
              <div
                className="flex items-center gap-2"
                aria-label={`Step ${step + 1} of ${steps.length}`}
              >
                {steps.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex flex-1 items-center gap-2"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${index <= step ? "bg-[#1f7a50] text-white" : "bg-[#edf2ed] text-[#819087]"}`}
                      >
                        {index < step ? <FiCheck /> : <Icon size={17} />}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#edf2ed]">
                          <div
                            className={`h-full rounded-full bg-[#1f7a50] transition-all duration-500 ${index < step ? "w-full" : "w-0"}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-5">
                <h2 className="font-serif text-3xl">{steps[step].title}</h2>
                <p className="mt-1 text-sm text-[#69766e]">
                  {steps[step].description}
                </p>
              </div>
            </div>

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      id="job-title"
                      {...register("title")}
                      error={errors.title}
                      label="Job title"
                      placeholder="e.g. Senior Product Designer"
                    />
                  </div>
                  <Input
                    id="job-company"
                    {...register("company")}
                    error={errors.company}
                    label="Company"
                    placeholder={companiesLoading ? "Loading companies..." : "Enter company name"}
                    disabled={companiesLoading || detailLoading}
                  />
                  {companiesError && (
                    <p className="text-xs font-semibold text-[#c34e42] sm:col-span-2">{companiesError}</p>
                  )}
                  {!companiesLoading && !companies.length && !companiesError && (
                    <div className="rounded-xl border border-[#f1d6a8] bg-[#fff8e9] p-4 text-sm text-[#805d28] sm:col-span-2">
                      <p className="font-bold">Register a company before creating a job.</p>
                      <Link to="/recruiter-companies" className="mt-1 inline-flex font-bold text-[#1f7a50] hover:underline">
                        Open company registration
                      </Link>
                    </div>
                  )}
                  <Input
                    id="job-location"
                    {...register("location")}
                    error={errors.location}
                    label="Location"
                    placeholder="e.g. Bengaluru or Remote"
                  />
                  <label className="flex flex-col text-sm font-bold text-[#53615a]">
                    Job type
                    <select {...register("jobType")} className={inputClass} defaultValue="">
                      <option value="">Choose a job type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                    <FieldError error={errors.jobType} />
                  </label>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5">
                  <label className="flex flex-col text-sm font-bold text-[#53615a]">
                    Job description
                    <textarea
                      {...register("description")}
                      className={`${inputClass} min-h-40 resize-y`}
                      placeholder="What will this person own and achieve?"
                    />
                    <span className="mt-1.5 block text-xs font-normal text-[#819087]">
                      Be specific about the impact this role will have.
                    </span>
                    <FieldError error={errors.description} />
                  </label>
                  <label className="flex flex-col text-sm font-bold text-[#53615a]">
                    Key requirements
                    <textarea
                      {...register("requirements")}
                      className={`${inputClass} min-h-36 resize-y`}
                      placeholder="One requirement per line\nStrong communication\n3+ years of experience"
                    />
                    <span className="mt-1.5 block text-xs font-normal text-[#819087]">
                      Add one requirement per line.
                    </span>
                    <FieldError error={errors.requirements} />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    id="job-salary"
                    {...register("salary")}
                    error={errors.salary}
                    label="Annual salary (INR)"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 1200000"
                  />
                  <Input
                    id="job-positions"
                    {...register("position")}
                    error={errors.position}
                    label="Open positions"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 3"
                  />
                  <label className="flex flex-col text-sm font-bold text-[#53615a] sm:col-span-2">
                    Experience level
                    <select
                      {...register("experienceLevel")}
                      className={inputClass}
                      defaultValue=""
                    >
                      <option value="">Choose an experience level</option>
                      <option value="Fresher">Fresher</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-4 years">3-4 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                    <FieldError error={errors.experienceLevel} />
                  </label>
                  <label className="flex flex-col text-sm font-bold text-[#53615a] sm:col-span-2">
                    Job status
                    <select
                      {...register("status")}
                      className={inputClass}
                      defaultValue="active"
                      disabled={detailLoading}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="closed">Closed</option>
                    </select>
                    <FieldError error={errors.status} />
                  </label>
                </div>
              )}

              <div className="mt-9 flex flex-col-reverse justify-between gap-3 border-t border-[#edf0ec] pt-6 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setStep((currentStep) => currentStep - 1)}
                  disabled={step === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[#69766e] transition hover:bg-[#f1f5ed] disabled:invisible"
                >
                  <FiArrowLeft /> Previous
                </button>
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={detailLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f7a50] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e] cursor-pointer"
                  >
                    Continue <FiArrowRight />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={mutationLoading || detailLoading || companiesLoading || !companies.length}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f7a50] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e] disabled:cursor-wait disabled:opacity-60 cursor-pointer"
                  >
                    {mutationLoading
                      ? "Saving..."
                      : isEditing
                        ? "Save changes"
                        : "Publish role"} <FiSend />
                  </button>
                )}
              </div>
            </form>
          </FadeIn>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
