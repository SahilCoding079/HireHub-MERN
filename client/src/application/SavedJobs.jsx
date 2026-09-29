import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiBriefcase, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import Loader from "../components/common/Loader";
import SaveJobButton from "../components/common/SaveJobButton";
import { FadeIn, StaggerContainer, StaggerItem } from "../components/motion/Motion";
import {
  savedJobsFailure,
  savedJobsStart,
  savedJobsSuccess,
} from "../redux/slices/savedJobsSlice";
import { getSavedJobs } from "../service/savedJobs.service";
import showToast from "../utils/toast";

const formatSalary = (salary) =>
  salary ? `₹${Number(salary).toLocaleString("en-IN")}` : "Salary not listed";

const SavedJobs = () => {
  const dispatch = useDispatch();
  const sentinelRef = useRef(null);
  const { savedJobs, pagination, isLoading, error } = useSelector(
    (state) => state.savedJobs,
  );

  const fetchSavedJobs = useCallback(
    async (page, append = false) => {
      dispatch(savedJobsStart());
      try {
        const response = await getSavedJobs(page, 10);
        dispatch(savedJobsSuccess({ response, append }));
      } catch (requestError) {
        const message =
          requestError.response?.data?.message || "Unable to load saved jobs.";
        dispatch(savedJobsFailure(message));
        if (!append) showToast.error(message);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    fetchSavedJobs(1);
  }, [fetchSavedJobs]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (
      !sentinel ||
      isLoading ||
      pagination.currentPage >= pagination.totalPages
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchSavedJobs(pagination.currentPage + 1, true);
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchSavedJobs, isLoading, pagination.currentPage, pagination.totalPages]);

  if (isLoading && !savedJobs.length) return <Loader />;

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <DashboardSidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <header className="border-b border-[#dfe8df] pb-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                Your shortlist
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                Saved jobs.
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#69766e]">
                Keep the opportunities worth coming back to close at hand.
              </p>
            </header>
          </FadeIn>

          {error && !savedJobs.length ? (
            <div className="mt-8 rounded-2xl border border-[#f1c7c2] bg-[#fff6f4] p-6 text-sm font-semibold text-[#c34e42]" role="alert">
              {error}
            </div>
          ) : savedJobs.length ? (
            <>
              <div className="mt-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold text-[#1f7a50]">
                    {pagination.totalSavedJobs}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#819087]">
                    Saved opportunities
                  </p>
                </div>
              </div>
              <StaggerContainer className="mt-5 grid gap-4">
                {savedJobs.map(({ _id, job }) => (
                  <StaggerItem key={_id}>
                    <article className="rounded-2xl border border-[#e2e7e1] bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#b8d4c2] hover:shadow-[0_15px_30px_rgba(46,74,57,0.08)] sm:p-6">
                      <div className="flex flex-col justify-between gap-5 sm:flex-row">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="group flex min-w-0 flex-1 gap-4"
                        >
                          {job.company?.logo ? (
                            <img
                              src={job.company.logo}
                              alt=""
                              className="h-12 w-12 shrink-0 rounded-xl border border-[#e5ebe5] object-contain p-1.5"
                            />
                          ) : (
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5f3eb] text-[#1f7a50]">
                              <FiBriefcase size={21} />
                            </span>
                          )}
                          <div className="min-w-0">
                            <h2 className="font-serif text-2xl text-[#19221d] group-hover:text-[#1f7a50]">
                              {job.title}
                            </h2>
                            <p className="mt-1 text-sm font-semibold text-[#69766e]">
                              {job.company?.name || "Company not listed"}
                            </p>
                          </div>
                        </Link>
                        <div className="flex items-start gap-2">
                          <span className="inline-flex h-fit w-fit items-center rounded-full bg-[#fff0d9] px-3 py-1.5 text-xs font-bold text-[#a9651c]">
                            {job.jobType}
                          </span>
                          <SaveJobButton jobId={job._id} />
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#edf0ec] pt-4 text-sm text-[#69766e]">
                        <span className="flex items-center gap-2">
                          <FiMapPin className="text-[#238457]" />
                          {job.location}
                        </span>
                        <span>{job.experienceLevel}</span>
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                    </article>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <div ref={sentinelRef} className="flex min-h-16 items-center justify-center">
                {isLoading && <Loader inline />}
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#cbd9ce] bg-white px-6 py-16 text-center">
              <FiBriefcase className="mx-auto text-[#1f7a50]" size={28} />
              <h2 className="mt-4 font-serif text-3xl">Nothing saved yet</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#69766e]">
                Save a promising role while you explore, then return here when you are ready.
              </p>
              <Link
                to="/find-job"
                className="mt-6 inline-flex rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white hover:bg-[#185e3e]"
              >
                Find jobs
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedJobs;
