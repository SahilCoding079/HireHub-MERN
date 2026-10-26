import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiMapPin,
  FiSearch,
} from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPublicJobs, searchJobs } from "../../service/jobs.service";
import {
  jobListFailure,
  jobListStart,
  jobListSuccess,
} from "../../redux/slices/jobSlice";
import Loader from "../../components/common/Loader";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "../../components/motion/Motion";
import SaveJobButton from "../../components/common/SaveJobButton";
import JobSearchAutocomplete from "../../components/common/JobSearchAutocomplete";


const filters = [
  {
    name: "jobType",
    label: "Job type",
    options: ["Part-time", "Full-time", "Internship", "Contract"],
  },
  {
    name: "experienceLevel",
    label: "Experience",
    options: ["Fresher", "1-2 years", "3-4 years", "5+ years"],
  },
];

const formatSalary = (salary) =>
  salary ? `₹${Number(salary).toLocaleString("en-IN")}` : "Salary not listed";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [retryToken, setRetryToken] = useState(0);

  const dispatch = useDispatch();

  const { jobs, pagination, isLoading, error } = useSelector(
    (state) => state.job,
  );

  useEffect(() => {
    const fetchJobs = async () => {
      dispatch(jobListStart());

      try {
        const params = Object.fromEntries(searchParams.entries());

        const hasSearchFilters = Object.keys(params).some(
          (key) => !["page", "limit"].includes(key),
        );

        const response = hasSearchFilters
          ? await searchJobs({
              ...params,
              page: searchParams.get("page") || 1,
              limit: 10,
            })
          : await getPublicJobs({
              page: searchParams.get("page") || 1,
              limit: 10,
            });

        dispatch(jobListSuccess(response));
      } catch (requestError) {
        dispatch(
          jobListFailure(
            requestError.response?.data?.message ||
              "Unable to load jobs right now.",
          ),
        );
      }
    };

    fetchJobs();
  }, [dispatch, retryToken, searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();

    const nextParams = new URLSearchParams();

    if (keyword.trim()) {
      nextParams.set("keyword", keyword.trim());
    }

    if (location.trim()) {
      nextParams.set("location", location.trim());
    }

    filters.forEach(({ name }) => {
      const value = searchParams.get(name);

      if (value) {
        nextParams.set(name, value);
      }
    });

    setSearchParams(nextParams);
  };

  const updateFilter = (name, value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(name, value);
    } else {
      nextParams.delete(name);
    }

    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const changePage = (page) => {
    const nextParams = new URLSearchParams(searchParams);

    if (page > 1) {
      nextParams.set("page", page);
    } else {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setKeyword("");
    setLocation("");
    setSearchParams({});
  };

  const hasActiveFilters = [
    "keyword",
    "location",
    "jobType",
    "experienceLevel",
  ].some((key) => searchParams.has(key));

  return (
    <div className="min-h-screen bg-[#f1f5ed] px-5 pb-16 pt-12 text-[#19221d] sm:px-8 lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
            Find your next chapter
          </p>

          <h1 className="mt-3 font-serif text-5xl leading-tight sm:text-6xl">
            Work that fits.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#69766e]">
            Explore thoughtful opportunities from teams looking for their next
            great person.
          </p>
        </FadeIn>

        <form
          onSubmit={handleSearch}
          className="mt-9 flex flex-col gap-2 rounded-2xl border border-[#d7e0d8] bg-white p-2 shadow-[0_12px_30px_rgba(46,74,57,0.06)] md:flex-row"
        >
          <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2">
            <FiSearch className="shrink-0 text-[#1f7a50]" size={20} />
            <JobSearchAutocomplete
              mode="keyword"
              value={keyword}
              location={location}
              onChange={setKeyword}
              placeholder="Job title, skill or company"
              ariaLabel="Search by keyword"
              className="flex-1"
              inputClassName="w-full bg-transparent text-sm outline-none placeholder:text-[#8a958e]"
            />
          </label>

          <label className="flex min-w-0 flex-1 items-center gap-3 border-[#edf0ec] px-3 py-2 md:border-l">
            <FiMapPin className="shrink-0 text-[#1f7a50]" size={20} />
            <JobSearchAutocomplete
              mode="location"
              value={location}
              onChange={setLocation}
              placeholder="Location or remote"
              ariaLabel="Search by location"
              className="flex-1"
              inputClassName="w-full bg-transparent text-sm outline-none placeholder:text-[#8a958e]"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1f7a50] px-6 text-sm font-bold text-white transition hover:bg-[#185e3e] focus:outline-none focus:ring-2 focus:ring-[#1f7a50] focus:ring-offset-2"
          >
            Search jobs <FiSearch size={16} />
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-3">
          {filters.map(({ name, label, options }) => (
            <label
              key={name}
              className="flex items-center gap-2 rounded-xl border border-[#d7e0d8] bg-white px-3 text-sm font-semibold text-[#53615a]"
            >
              <span className="sr-only">{label}</span>

              <select
                value={searchParams.get(name) || ""}
                onChange={(event) => updateFilter(name, event.target.value)}
                aria-label={label}
                className="cursor-pointer bg-transparent py-2.5 outline-none"
              >
                <option value="">{label}</option>

                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-[#f0c7c2] bg-white px-6 py-14 text-center">
            <p className="font-semibold text-[#c34e42]">{error}</p>

            <button
              type="button"
              onClick={() => setRetryToken((token) => token + 1)}
              className="mt-5 rounded-xl bg-[#1f7a50] px-4 py-2.5 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="mt-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">
                  Open opportunities
                </p>

                <p className="mt-2 text-sm text-[#69766e]">
                  {pagination.totalJobs} roles found
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-bold text-[#1f7a50] hover:text-[#185e3e]"
                >
                  Clear filters
                </button>
              )}
            </div>

            {jobs.length ? (
              <StaggerContainer className="mt-5 grid gap-4">
                {jobs.map((job) => (
                  <StaggerItem key={job._id}>
                    <article className="rounded-2xl border border-[#e2e7e1] bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#b8d4c2] hover:shadow-[0_15px_30px_rgba(46,74,57,0.08)] sm:p-6">
                      <div className="flex flex-col justify-between gap-5 sm:flex-row">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="group flex min-w-0 flex-1 gap-4"
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5f3eb] text-[#1f7a50]">
                            <FiBriefcase size={21} />
                          </span>

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
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-[#cbd9ce] bg-white px-6 py-16 text-center">
                <FiBriefcase className="mx-auto text-[#1f7a50]" size={28} />

                <h2 className="mt-4 font-serif text-3xl">
                  {searchParams.get("keyword") && searchParams.get("location")
                    ? `No ${searchParams.get("keyword")} jobs found in ${searchParams.get("location")}.`
                    : searchParams.get("location")
                      ? `No jobs found in ${searchParams.get("location")}.`
                      : searchParams.get("keyword")
                        ? `No jobs found for ${searchParams.get("keyword")}.`
                        : "No roles match yet"}
                </h2>

                <p className="mt-2 text-sm text-[#69766e]">
                  Try another search or clear your filters.
                </p>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <nav
                aria-label="Job pagination"
                className="mt-8 flex items-center justify-center gap-3"
              >
                <button
                  type="button"
                  disabled={pagination.currentPage <= 1}
                  onClick={() => changePage(pagination.currentPage - 1)}
                  aria-label="Previous page"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#cbd9ce] bg-white text-[#1f7a50] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiArrowLeft />
                </button>

                <span className="text-sm font-bold text-[#53615a]">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => changePage(pagination.currentPage + 1)}
                  aria-label="Next page"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#cbd9ce] bg-white text-[#1f7a50] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiArrowRight />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
