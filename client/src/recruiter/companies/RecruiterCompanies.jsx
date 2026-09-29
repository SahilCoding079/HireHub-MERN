import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiEdit2,
  FiGlobe,
  FiMapPin,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import RecruiterDashboardSidebar from "../../components/dashboard/RecruiterDashboardSidebar";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "../../components/motion/Motion";
import Loader from "../../components/common/Loader";
import ConfirmModal from "../../components/ui/ConfirmModal";
import showToast from "../../utils/toast";
import {
  createRecruiterCompany,
  deleteRecruiterCompany,
  getRecruiterCompanies,
  updateRecruiterCompany,
} from "../../service/recruiter/recruiterCompanies.service";
import {
  recruiterCompaniesFailure,
  recruiterCompaniesStart,
  recruiterCompaniesSuccess,
  recruiterCompanyMutationFailure,
  recruiterCompanyMutationStart,
  recruiterCompanyMutationSuccess,
  recruiterCompanyRemoved,
} from "../../redux/slices/recruiterCompaniesSlice";
import { recruiterCompanyUpdated } from "../../redux/slices/recruiterJobsSlice";

const emptyForm = {
  name: "",
  description: "",
  website: "",
  location: "",
  logo: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#d7e0d8] bg-[#fbfcfa] px-4 py-3 text-sm text-[#19221d] outline-none transition placeholder:text-[#a0aaa2] focus:border-[#238457] focus:ring-2 focus:ring-[#e5f3eb]";

const RecruiterCompanies = () => {
  const dispatch = useDispatch();
  const { companies, isLoading, mutationLoading, error } = useSelector(
    (state) => state.recruiterCompanies,
  );
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  useEffect(() => {
    const loadCompanies = async () => {
      dispatch(recruiterCompaniesStart());
      try {
        dispatch(recruiterCompaniesSuccess(await getRecruiterCompanies()));
      } catch (requestError) {
        dispatch(
          recruiterCompaniesFailure(
            requestError.response?.data?.message || "Unable to load companies.",
          ),
        );
      }
    };
    loadCompanies();
  }, [dispatch]);

  const handleChange = ({ target }) => {
    setForm((currentForm) => ({ ...currentForm, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.location.trim()
    ) {
      setFormError("Company name, description, and location are required.");
      return;
    }

    dispatch(recruiterCompanyMutationStart());
    try {
      const response = editingId
        ? await updateRecruiterCompany(editingId, form)
        : await createRecruiterCompany(form);
      dispatch(recruiterCompanyMutationSuccess(response));
      if (editingId && response.data)
        dispatch(recruiterCompanyUpdated(response.data));
      showToast.success(
        response.message ||
          (editingId ? "Company updated." : "Company registered."),
      );
      setForm(emptyForm);
      setEditingId(null);
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || "Unable to save this company.";
      dispatch(recruiterCompanyMutationFailure(message));
      setFormError(message);
      showToast.error(message);
    }
  };

  const handleEdit = (company) => {
    setEditingId(company._id);
    setForm({
      name: company.name || "",
      description: company.description || "",
      website: company.website || "",
      location: company.location || "",
      logo: company.logo || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!companyToDelete) return;
    const company = companyToDelete;
    dispatch(recruiterCompanyMutationStart());
    try {
      await deleteRecruiterCompany(company._id);
      dispatch(recruiterCompanyRemoved(company._id));
      showToast.success("Company deleted.");
      setCompanyToDelete(null);
      if (editingId === company._id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to delete this company.";
      dispatch(recruiterCompanyMutationFailure(message));
      showToast.error(message);
    }
  };

  if (isLoading && !companies.length) return <Loader />;

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <RecruiterDashboardSidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <Link
              to="/recruiter-dashboard"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#69766e] hover:text-[#1f7a50]"
            >
              <FiArrowLeft /> Back to dashboard
            </Link>
            <div className="mt-7 flex flex-col justify-between gap-5 border-b border-[#dfe8df] pb-8 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                  Recruiter workspace
                </p>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                  Your companies.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#69766e]">
                  Register the company behind each role before you publish a
                  job.
                </p>
              </div>
              <Link
                to="/recruiter-jobs/new"
                className="inline-flex items-center gap-2 rounded-xl border border-[#b8d4c2] px-4 py-3 text-sm font-bold text-[#1f7a50] hover:bg-white"
              >
                <FiPlus /> Create a role
              </Link>
            </div>
          </FadeIn>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <FadeIn className="h-fit rounded-2xl border border-[#dfe8df] bg-white p-5 shadow-[0_10px_28px_rgba(31,67,46,0.04)] sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#238457]">
                {editingId ? "Edit company" : "Register company"}
              </p>
              <h2 className="mt-2 font-serif text-3xl">
                {editingId ? "Update the details." : "Add your company."}
              </h2>
              <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
                <label className="text-sm font-bold text-[#53615a]">
                  Company name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Northstar Labs"
                  />
                </label>
                <label className="text-sm font-bold text-[#53615a]">
                  Description
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className={`${inputClass} min-h-28 resize-y`}
                    placeholder="What does your company do?"
                  />
                </label>
                <label className="text-sm font-bold text-[#53615a]">
                  Location
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Bengaluru or Remote"
                  />
                </label>
                <label className="text-sm font-bold text-[#53615a]">
                  Website{" "}
                  <span className="font-normal text-[#819087]">(optional)</span>
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://example.com"
                  />
                </label>
                <label className="text-sm font-bold text-[#53615a]">
                  Logo URL{" "}
                  <span className="font-normal text-[#819087]">(optional)</span>
                  <input
                    name="logo"
                    value={form.logo}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </label>
                {formError && (
                  <p
                    className="text-xs font-semibold text-[#c34e42]"
                    role="alert"
                  >
                    {formError}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={mutationLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1f7a50] px-5 py-3 text-sm font-bold text-white hover:bg-[#185e3e] disabled:cursor-wait disabled:opacity-60"
                  >
                    {mutationLoading
                      ? "Saving..."
                      : editingId
                        ? "Save changes"
                        : "Register company"}{" "}
                    <FiPlus />
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyForm);
                        setFormError(null);
                      }}
                      className="rounded-xl px-4 py-3 text-sm font-bold text-[#69766e] hover:bg-[#f1f5ed]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </FadeIn>

            <section>
              {error && (
                <div
                  className="mb-5 rounded-2xl border border-[#f1c7c2] bg-[#fff6f4] p-5 text-sm font-semibold text-[#c34e42]"
                  role="alert"
                >
                  {error}
                </div>
              )}
              {companies.length ? (
                <StaggerContainer className="grid gap-4 sm:grid-cols-2">
                  {companies.map((company) => (
                    <StaggerItem key={company._id}>
                      <article className="h-full rounded-2xl border border-[#dfe8df] bg-white p-5 shadow-[0_10px_28px_rgba(31,67,46,0.04)]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            {company.logo ? (
                              <img
                                src={company.logo}
                                alt=""
                                className="h-11 w-11 rounded-xl object-contain"
                              />
                            ) : (
                              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f3eb] text-[#1f7a50]">
                                <FiBriefcase size={20} />
                              </span>
                            )}
                            <h2 className="truncate text-lg font-bold capitalize">
                              {company.name}
                            </h2>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(company)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#1f7a50] hover:bg-[#e5f3eb]"
                              aria-label={`Edit ${company.name}`}
                            >
                              <FiEdit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCompanyToDelete(company)}
                              disabled={mutationLoading}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#c34e42] hover:bg-[#fff6f4]"
                              aria-label={`Delete ${company.name}`}
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </div>
                        <p className="mt-5 text-sm leading-6 text-[#69766e]">
                          {company.description}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3 border-t border-[#edf0ec] pt-4 text-xs font-semibold text-[#819087]">
                          <span className="flex items-center gap-1.5">
                            <FiMapPin className="text-[#238457]" />
                            {company.location}
                          </span>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 hover:text-[#1f7a50]"
                            >
                              <FiGlobe className="text-[#238457]" />
                              Website
                            </a>
                          )}
                        </div>
                      </article>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#b8d4c2] bg-white px-6 py-16 text-center">
                  <FiBriefcase className="mx-auto text-[#1f7a50]" size={28} />
                  <h2 className="mt-4 font-serif text-3xl">
                    No companies yet.
                  </h2>
                  <p className="mt-2 text-sm text-[#69766e]">
                    Register your first company to unlock job creation.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <ConfirmModal
        isOpen={Boolean(companyToDelete)}
        title="Delete this company?"
        message={`${companyToDelete?.name || "This company"} will be removed. Jobs linked to it may no longer display company details.`}
        isLoading={mutationLoading}
        onCancel={() => setCompanyToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default RecruiterCompanies;
