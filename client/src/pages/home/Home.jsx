import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiCheck,
  FiMapPin,
  FiSearch,
  FiShield,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import {
  FadeIn,
  Float,
  StaggerContainer,
  StaggerItem,
} from "../../components/motion/Motion";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import { getPublicCompanies, getPublicJobs } from "../../service/jobs.service";
import {
  jobListFailure,
  jobListStart,
  jobListSuccess,
} from "../../redux/slices/jobSlice";
import {
  publicCompaniesFailure,
  publicCompaniesStart,
  publicCompaniesSuccess,
} from "../../redux/slices/publicCompaniesSlice";
import showToast from "../../utils/toast";
import SaveJobButton from "../../components/common/SaveJobButton";

const formatSalary = (salary) =>
  salary ? `₹${Number(salary).toLocaleString("en-IN")}` : "Salary not listed";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { jobs, pagination, isLoading: jobsLoading, error: jobsError } = useSelector(
    (state) => state.job,
  );
  const {
    companies,
    isLoading: companiesLoading,
    error: companiesError,
  } = useSelector((state) => state.publicCompanies);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    dispatch(jobListStart());
    getPublicJobs({ page: 1, limit: 6 })
      .then((response) => dispatch(jobListSuccess(response)))
      .catch((error) =>
        dispatch(
          jobListFailure(
            error.response?.data?.message ||
              "Unable to load opportunities right now.",
          ),
        ),
      );

    dispatch(publicCompaniesStart());
    getPublicCompanies()
      .then((response) => dispatch(publicCompaniesSuccess(response.data)))
      .catch((error) =>
        dispatch(
          publicCompaniesFailure(
            error.response?.data?.message ||
              "Unable to load companies right now.",
          ),
        ),
      );
  }, [dispatch]);

  const isLoading = jobsLoading || companiesLoading;
  const totalJobs = pagination.totalJobs;

  const handleSearch = (event) => {
    event.preventDefault();
    const searchParams = new URLSearchParams();
    if (keyword.trim()) searchParams.set("keyword", keyword.trim());
    if (location.trim()) searchParams.set("location", location.trim());
    const jobsPath = `/jobs${searchParams.toString() ? `?${searchParams}` : ""}`;

    if (!isAuthenticated) {
      showToast.error("Please log in to search for jobs.");
      navigate("/login", { state: { from: jobsPath } });
      return;
    }

    navigate(jobsPath);
  };

  return (
    <main className="overflow-hidden bg-[#f8f7f3] text-[#19221d]">
      <section className="relative isolate border-b border-[#dfe5df] bg-[#eef5ee]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_8%,rgba(216,235,218,0.9),transparent_30%),radial-gradient(circle_at_91%_15%,rgba(247,224,185,0.7),transparent_25%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1fr_0.92fr] lg:gap-20 lg:px-10 lg:pb-28 lg:pt-24">
          <FadeIn className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b8d4c2] bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-700" /> The better
              way to work
            </div>
            <h1 className="max-w-xl font-serif text-5xl leading-[0.98] tracking-[-0.02em] text-[#19221d] sm:text-7xl lg:text-[5.5rem]">
              Find work that feels{" "}
              <span className="italic text-green-700">like you.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#53615a] sm:text-lg">
              Thoughtful opportunities from teams building what matters. Search
              less, discover more, and make your next move count.
            </p>

            <motion.form
              onSubmit={handleSearch}
              className="mt-9 flex flex-col gap-2 rounded-3xl border border-[#d7e0d8] bg-white p-2.5 shadow-[0_18px_45px_rgba(46,74,57,0.12)] ring-1 ring-white/80 sm:flex-row sm:items-center"
              whileHover={{
                y: -2,
                boxShadow: "0 22px 50px rgba(46,74,57,0.14)",
              }}
              transition={{ duration: 0.25 }}
            >
              <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2">
                <FiSearch className="shrink-0 text-green-700" size={20} />
                <input
                  aria-label="Search jobs"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Job title, skill or company"
                  className="w-full bg-transparent text-sm text-[#19221d] outline-none placeholder:text-[#8a958e]"
                />
              </label>
              <div className="hidden h-8 w-px bg-[#e3e8e3] sm:block" />
              <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2">
                <FiMapPin className="shrink-0 text-green-700" size={20} />
                <input
                  aria-label="Search location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Anywhere"
                  className="w-full bg-transparent text-sm text-[#19221d] outline-none placeholder:text-[#8a958e]"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 text-sm font-bold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-800 cursor-pointer focus:ring-offset-2"
              >
                Search jobs <FiArrowUpRight size={17} />
              </button>
            </motion.form>
            {jobs.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[#69766e]">
                <span className="font-semibold text-[#53615a]">Recently listed:</span>
                {jobs.slice(0, 3).map((job) => (
                  <Link
                    key={job._id}
                    to={`/jobs/${job._id}`}
                    className="rounded-full bg-white/80 px-3 py-1.5 hover:text-[#1f7a50]"
                  >
                    {job.title}
                  </Link>
                ))}
              </div>
            )}
          </FadeIn>

          <div className="relative mx-auto w-full max-w-130 lg:mr-0">
            <motion.div
              className="relative aspect-[0.88] overflow-hidden rounded-4xl border-8 border-white bg-[#c5d8c9] shadow-[18px_22px_0_#cfe2d3]"
              initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85"
                alt="A collaborative team working together"
                className="absolute inset-0 h-full w-full object-cover object-center opacity-100"
              />
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(31,122,80,0.08),transparent_55%,rgba(255,205,133,0.12))]" />
            </motion.div>
            <Float className="absolute -bottom-7 -left-5 w-[min(82%,270px)] sm:-left-9">
              <div className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_18px_35px_rgba(25,54,38,0.15)] backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#839088]">
                    On HireHub
                  </span>
                </div>
                <p className="mt-3 font-serif text-xl text-[#19221d]">
                  {totalJobs} open {totalJobs === 1 ? "role" : "roles"}
                </p>
                <p className="mt-3 text-xs text-[#69766e]">
                  Explore the latest active listings.
                </p>
              </div>
            </Float>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24" id="opportunities">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
              Latest opportunities
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl tracking-tight sm:text-5xl">
              Work that fits your next move.
            </h2>
          </FadeIn>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1f7a50] hover:text-[#185e3e]"
          >
            Browse all roles <FiArrowUpRight />
          </Link>
        </div>
        {jobs[0] && (
          <Link
            to={`/jobs/${jobs[0]._id}`}
            className="group mt-10 flex flex-col justify-between gap-6 rounded-3xl border border-[#b8d4c2] bg-[#e5f3eb] p-6 shadow-[0_15px_35px_rgba(46,74,57,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(46,74,57,0.12)] sm:flex-row sm:items-center sm:p-8"
          >
            <div className="flex min-w-0 items-center gap-4">
              {jobs[0].company?.logo ? (
                <img
                  src={jobs[0].company.logo}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-2xl border border-white bg-white object-contain p-2"
                />
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#1f7a50]">
                  <FiBriefcase size={24} />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1f7a50]">
                  Latest opportunity
                </p>
                <h3 className="mt-2 truncate font-serif text-2xl text-[#19221d] sm:text-3xl">
                  {jobs[0].title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#53615a]">
                  {jobs[0].company?.name || "Company not listed"}
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#1f7a50]">
              View opportunity <FiArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </Link>
        )}
        {isLoading ? (
          <div className="mt-10 flex justify-center rounded-2xl border border-[#e2e7e1] bg-white py-16">
            <Loader inline />
          </div>
        ) : jobsError || companiesError ? (
          <div className="mt-10 rounded-2xl border border-[#f0c7c2] bg-white px-6 py-14 text-center">
            <p className="font-semibold text-[#c34e42]">
              {jobsError || companiesError}
            </p>
          </div>
        ) : jobs.length ? (
          <StaggerContainer className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <StaggerItem key={job._id}>
                <article className="group h-full rounded-2xl border border-[#e2e7e1] bg-white p-5 shadow-[0_8px_22px_rgba(46,74,57,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#b8d4c2] hover:shadow-[0_18px_35px_rgba(46,74,57,0.1)]">
                  <div className="flex items-start justify-between gap-4">
                    <Link to={`/jobs/${job._id}`} className="flex min-w-0 flex-1 gap-3">
                      {job.company?.logo ? (
                        <img
                          src={job.company.logo}
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-xl border border-[#e5ebe5] object-contain p-1.5"
                        />
                      ) : (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f3eb] text-[#1f7a50]">
                          <FiBriefcase size={19} />
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate font-serif text-xl text-[#19221d] group-hover:text-[#1f7a50]">
                          {job.title}
                        </h3>
                        <p className="mt-1 truncate text-sm font-semibold text-[#69766e]">
                          {job.company?.name || "Company not listed"}
                        </p>
                      </div>
                    </Link>
                    <div className="flex shrink-0 items-center gap-2">
                      <FiArrowUpRight className="text-[#238457] transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                      <SaveJobButton jobId={job._id} />
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#edf0ec] pt-4 text-xs text-[#69766e]">
                    <span className="flex items-center gap-1.5">
                      <FiMapPin className="text-[#238457]" /> {job.location}
                    </span>
                    <span>{job.jobType}</span>
                    <span>{formatSalary(job.salary)}</span>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-[#cbd9ce] bg-white px-6 py-14 text-center">
            <FiBriefcase className="mx-auto text-[#1f7a50]" size={28} />
            <p className="mt-4 font-serif text-2xl">No open roles yet.</p>
          </div>
        )}
      </section>

      {companies.length > 0 && (
        <section className="border-y border-[#dfe5df] bg-[#e8f0e8]" id="companies">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="text-sm font-semibold text-[#69766e]">
            Companies hiring on HireHub
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {companies.slice(0, 6).map((company) => (
              <div key={company._id} className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-[#748279]">
                {company.logo ? (
                  <img src={company.logo} alt="" className="h-7 w-7 rounded-lg object-contain" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e5f3eb] text-xs text-[#1f7a50]">
                    {company.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
                {company.name}
              </div>
            ))}
          </div>
        </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <FadeIn>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f7a50] text-white">
              <FiShield size={23} />
            </span>
            <h2 className="mt-6 max-w-md font-serif text-4xl leading-tight sm:text-5xl">
              Good work starts with a little more{" "}
              <span className="italic text-[#238457]">care.</span>
            </h2>
          </FadeIn>
          <StaggerContainer className="grid gap-8 sm:grid-cols-3">
            {[
              [
                "01",
                "Human-first",
                "Real people, real context, and opportunities that respect both.",
              ],
              [
                "02",
                "Clearer choices",
                "The details you need to make a confident next move.",
              ],
              [
                "03",
                "Built to grow",
                "A career platform that moves with the way you work.",
              ],
            ].map(([number, title, copy]) => (
              <StaggerItem
                key={number}
                className="border-t border-[#cfd9d1] pt-4"
              >
                <span className="text-xs font-bold text-[#238457]">
                  {number}
                </span>
                <h3 className="mt-8 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#69766e]">{copy}</p>
                <FiCheck className="mt-7 text-[#238457]" />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-[#1f7a50] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bce2c8]">
              Your next move
            </p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-6xl">
              Make room for something better.
            </h2>
          </div>
          <a
            href="/register"
            className="inline-flex items-center gap-3 rounded-xl bg-[#f7ca82] px-5 py-3 text-sm font-bold text-[#213128] transition hover:bg-[#ffda9c]"
          >
            Create your profile <FiArrowUpRight />
          </a>
        </div>
      </section>
    </main>
  );
};

export default Home;
