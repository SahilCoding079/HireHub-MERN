import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft, FiBriefcase, FiCalendar, FiClock, FiDownload, FiMail, FiPhone, FiUser } from "react-icons/fi";
import RecruiterDashboardSidebar from "../../components/dashboard/RecruiterDashboardSidebar";
import Loader from "../../components/common/Loader";
import showToast from "../../utils/toast";
import {
  recruiterApplicantDetailFailure,
  recruiterApplicantDetailStart,
  recruiterApplicantDetailSuccess,
} from "../../redux/slices/recruiterJobsSlice";
import {
  interviewScheduleFailure,
  interviewScheduleStart,
  interviewScheduleSuccess,
} from "../../redux/slices/interviewScheduleSlice";
import { getApplicantDetails, scheduleApplicantInterview } from "../../service/recruiter/recruiterJobs.service";
import { InterviewSchema, interviewFormDefaults } from "../../validations/InterviewSchema";

const toLocalDateTimeInput = (date) => {
  if (!date) return "";
  const localDate = new Date(date);
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

const toInterviewFormValues = (interview) => ({
  ...interviewFormDefaults,
  ...interview,
  scheduledAt: toLocalDateTimeInput(interview?.scheduledAt),
});

const inputClass = "mt-2 w-full rounded-xl border border-[#d7e0d8] bg-[#fbfcfa] px-4 py-3 text-sm text-[#19221d] outline-none transition placeholder:text-[#a0aaa2] focus:border-[#238457] focus:ring-2 focus:ring-[#e5f3eb]";

const RecruiterApplicantDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedApplicant, detailLoading, detailError } = useSelector((state) => state.recruiterJobs);
  const { isSubmitting, error: interviewError } = useSelector((state) => state.interviewSchedule);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(InterviewSchema),
    defaultValues: interviewFormDefaults,
    mode: "onTouched",
  });
  const interviewMode = useWatch({ control, name: "mode" });

  useEffect(() => {
    const loadApplicant = async () => {
      dispatch(recruiterApplicantDetailStart());
      try {
        dispatch(recruiterApplicantDetailSuccess(await getApplicantDetails(id)));
      } catch (requestError) {
        const message = requestError.response?.data?.message || "Unable to load applicant details.";
        dispatch(recruiterApplicantDetailFailure(message));
        showToast.error(message);
      }
    };
    loadApplicant();
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedApplicant) reset(toInterviewFormValues(selectedApplicant.interview));
  }, [reset, selectedApplicant]);

  const onScheduleInterview = async (values) => {
    dispatch(interviewScheduleStart());
    try {
      const response = await scheduleApplicantInterview(id, {
        ...values,
        scheduledAt: new Date(values.scheduledAt).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        durationMinutes: Number(values.durationMinutes),
      });
      dispatch(interviewScheduleSuccess(response));
      dispatch(recruiterApplicantDetailSuccess(response));
      reset(toInterviewFormValues(response.data.interview));
      showToast.success(response.message || "Interview scheduled and invitation emailed.");
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to schedule this interview.";
      dispatch(interviewScheduleFailure(message));
      showToast.error(message);
    }
  };

  if (detailLoading || !selectedApplicant) return <Loader />;
  if (detailError) return <p className="p-10 text-center text-[#c34e42]">{detailError}</p>;

  const applicant = selectedApplicant.applicant || {};
  const job = selectedApplicant.job || {};
  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]"><RecruiterDashboardSidebar /><main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12"><div className="mx-auto max-w-3xl">
      <Link to="/recruiter-applicants" className="inline-flex items-center gap-2 text-sm font-bold text-[#69766e] hover:text-[#1f7a50]"><FiArrowLeft /> Back to applicants</Link>
      <section className="mt-7 rounded-2xl border border-[#dfe8df] bg-white p-6 sm:p-8"><div className="flex items-start gap-4 border-b border-[#edf0ec] pb-6">{applicant.profilePhoto ? <img src={applicant.profilePhoto} alt="" className="h-16 w-16 rounded-2xl object-cover" /> : <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5f3eb] text-[#1f7a50]"><FiUser size={26} /></span>}<div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">Applicant profile</p><h1 className="mt-2 font-serif text-4xl">{applicant.fullName || "Applicant"}</h1><p className="mt-2 text-sm text-[#69766e]">{applicant.email || "Email unavailable"}</p></div></div>
        <div className="grid gap-4 py-6 text-sm text-[#69766e] sm:grid-cols-2"><p className="flex items-center gap-2"><FiBriefcase className="text-[#238457]" />{job.title || "Role unavailable"}</p><p className="flex items-center gap-2"><FiMail className="text-[#238457]" />{applicant.email || "Email unavailable"}</p>{applicant.phone && <p className="flex items-center gap-2"><FiPhone className="text-[#238457]" />{applicant.phone}</p>}</div>
        {applicant.bio && <p className="border-t border-[#edf0ec] pt-6 text-sm leading-7 text-[#69766e]">{applicant.bio}</p>}{applicant.skills?.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{applicant.skills.map((skill) => <span key={skill} className="rounded-full bg-[#e8f0e8] px-3 py-1.5 text-xs font-bold text-[#1f7a50]">{skill}</span>)}</div>}{applicant.resume && <a href={applicant.resume} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white hover:bg-[#185e3e]"><FiDownload /> View resume</a>}
      </section>
      <section className="mt-5 rounded-2xl border border-[#dfe8df] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">Candidate meeting</p>
            <h2 className="mt-2 font-serif text-3xl">{selectedApplicant.interview ? "Interview scheduled" : "Schedule an interview"}</h2>
            <p className="mt-2 text-sm text-[#69766e]">The candidate will receive the details at {applicant.email}.</p>
          </div>
          {selectedApplicant.interview && <span className="inline-flex items-center gap-2 rounded-full bg-[#e5f3eb] px-3 py-1.5 text-xs font-bold text-[#16734f]"><FiCalendar /> Scheduled</span>}
        </div>
        <form onSubmit={handleSubmit(onScheduleInterview)} className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col text-sm font-bold text-[#53615a]">
            Date and time
            <input type="datetime-local" min={toLocalDateTimeInput(new Date())} {...register("scheduledAt")} className={inputClass} />
            {errors.scheduledAt && <span className="mt-1.5 text-xs font-semibold text-[#c34e42]">{errors.scheduledAt.message}</span>}
          </label>
          <label className="flex flex-col text-sm font-bold text-[#53615a]">
            Duration
            <select {...register("durationMinutes")} className={inputClass}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1 hour 30 minutes</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
            </select>
            {errors.durationMinutes && <span className="mt-1.5 text-xs font-semibold text-[#c34e42]">{errors.durationMinutes.message}</span>}
          </label>
          <label className="flex flex-col text-sm font-bold text-[#53615a]">
            Format
            <select {...register("mode")} className={inputClass}>
              <option value="online">Online</option>
              <option value="in_person">In person</option>
            </select>
            {errors.mode && <span className="mt-1.5 text-xs font-semibold text-[#c34e42]">{errors.mode.message}</span>}
          </label>
          {interviewMode === "online" ? (
            <label className="flex flex-col text-sm font-bold text-[#53615a]">
              Meeting link
              <input type="url" {...register("meetingLink")} placeholder="https://meet.example.com/..." className={inputClass} />
              {errors.meetingLink && <span className="mt-1.5 text-xs font-semibold text-[#c34e42]">{errors.meetingLink.message}</span>}
            </label>
          ) : (
            <label className="flex flex-col text-sm font-bold text-[#53615a]">
              Location
              <input {...register("location")} placeholder="Office address or room" className={inputClass} />
              {errors.location && <span className="mt-1.5 text-xs font-semibold text-[#c34e42]">{errors.location.message}</span>}
            </label>
          )}
          <label className="flex flex-col text-sm font-bold text-[#53615a] sm:col-span-2">
            Notes for the candidate <span className="font-normal text-[#819087]">(optional, up to 500 characters)</span>
            <textarea rows="3" maxLength="500" {...register("notes")} placeholder="Anything they should prepare or bring" className={inputClass} />
            {errors.notes && <span className="mt-1.5 text-xs font-semibold text-[#c34e42]">{errors.notes.message}</span>}
          </label>
          {interviewError && <p className="text-sm font-semibold text-[#c34e42] sm:col-span-2" role="alert">{interviewError}</p>}
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-[#1f7a50] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e] disabled:cursor-wait disabled:opacity-60">
              <FiCalendar /> {isSubmitting ? "Sending invitation..." : selectedApplicant.interview ? "Reschedule and email candidate" : "Schedule and email candidate"}
            </button>
            {selectedApplicant.interview && <p className="flex items-center gap-2 text-xs font-semibold text-[#69766e]"><FiClock /> Saving sends the updated invitation to the candidate.</p>}
          </div>
        </form>
      </section>
    </div></main></div>
  );
};

export default RecruiterApplicantDetail;