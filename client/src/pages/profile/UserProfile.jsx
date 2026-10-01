import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCamera,
  FiCheck,
  FiEdit2,
  FiFileText,
  FiLoader,
  FiMail,
  FiPhone,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiUser,
} from "react-icons/fi";
import {
  deletePhotoFailure,
  deletePhotoStart,
  deletePhotoSuccess,
  deleteResumeFailure,
  deleteResumeStart,
  deleteResumeSuccess,
  profileFailure,
  profilePhotoFailure,
  profilePhotoStart,
  profilePhotoSuccess,
  profileStart,
  profileSuccess,
  resumeUploadFailure,
  resumeUploadStart,
  resumeUploadSuccess,
  updateProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
} from "../../redux/slices/profileSlice";
import { setUser } from "../../redux/slices/authSlice";
import {
  deleteProfilePhoto,
  deleteResume,
  getUserProfile,
  updateProfile,
  updateProfilePhoto,
  uploadResume,
} from "../../service/userProfile.service";
import Loader from "../../components/common/Loader";
import Input from "../../components/ui/Input";
import showToast from "../../utils/toast";
import { ProfileSchema } from "../../validations/ProfileSchema";
import { Link, useNavigate } from "react-router-dom";

const initialForm = { fullName: "", phone: "", bio: "", skills: "" };
const getData = (response) => response?.data ?? response;

const UserProfile = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const {
    profile,
    isLoading,
    error,
    isUpdating,
    isUploadingPhoto,
    isUploadingResume,
    isDeletingResume,
    isDeletingPhoto,
  } = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const isBusy =
    isUpdating ||
    isUploadingPhoto ||
    isUploadingResume ||
    isDeletingResume ||
    isDeletingPhoto;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: initialForm,
  });
  const navigate = useNavigate();
  const syncAuthenticatedUser = (updatedUser) => {
    if (updatedUser) {
      dispatch(setUser({ ...authUser, ...updatedUser }));
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(profileStart());
      try {
        dispatch(profileSuccess(getData(await getUserProfile())));
      } catch (fetchError) {
        dispatch(
          profileFailure(
            fetchError.response?.data?.message || fetchError.message,
          ),
        );
      }
    };
    fetchProfile();
  }, [dispatch]);

  const toggleEditor = () => {
    if (!isEditing) {
      reset({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        skills: (profile.skills || []).join(", "),
      });
    }
    setIsEditing(!isEditing);
  };

  const saveProfile = async (values) => {
    dispatch(updateProfileStart());
    try {
      const skills = values.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
      const updatedProfile = getData(
        await updateProfile({ ...values, skills }),
      );
      dispatch(updateProfileSuccess(updatedProfile));
      syncAuthenticatedUser(updatedProfile);
      setIsEditing(false);
      showToast.success("Profile details updated");
    } catch (saveError) {
      dispatch(
        updateProfileFailure(
          saveError.response?.data?.message || saveError.message,
        ),
      );
      showToast.error(
        saveError.response?.data?.message || "Unable to update your profile",
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  const changePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast.error("Choose an image file");
      return;
    }
    dispatch(profilePhotoStart());
    try {
      const data = new FormData();
      data.append("profilePhoto", file);
      const updatedProfile = getData(await updateProfilePhoto(data));
      dispatch(profilePhotoSuccess(updatedProfile));
      syncAuthenticatedUser(updatedProfile);
      showToast.success("Profile photo updated");
    } catch (photoError) {
      dispatch(
        profilePhotoFailure(
          photoError.response?.data?.message || photoError.message,
        ),
      );
      showToast.error(
        photoError.response?.data?.message || "Unable to update your photo",
      );
    }
  };

  const removePhoto = async () => {
    dispatch(deletePhotoStart());
    try {
      const updatedProfile = getData(await deleteProfilePhoto());
      dispatch(deletePhotoSuccess(updatedProfile));
      syncAuthenticatedUser(updatedProfile);
      showToast.success("Profile photo removed");
    } catch (photoError) {
      dispatch(
        deletePhotoFailure(
          photoError.response?.data?.message || photoError.message,
        ),
      );
      showToast.error(
        photoError.response?.data?.message || "Unable to remove your photo",
      );
    }
  };

  const changeResume = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      showToast.error("Please choose a PDF resume");
      return;
    }
    dispatch(resumeUploadStart());
    try {
      const data = new FormData();
      data.append("resume", file);
      const updatedProfile = getData(await uploadResume(data));
      dispatch(resumeUploadSuccess(updatedProfile));
      syncAuthenticatedUser(updatedProfile);
      showToast.success("Resume uploaded");
    } catch (resumeError) {
      dispatch(
        resumeUploadFailure(
          resumeError.response?.data?.message || resumeError.message,
        ),
      );
      showToast.error(
        resumeError.response?.data?.message || "Unable to upload your resume",
      );
    }
  };

  const removeResume = async () => {
    dispatch(deleteResumeStart());
    try {
      await deleteResume();
      const updatedProfile = {
        resume: "",
        resumeOriginalName: "",
        resumePublicId: "",
      };
      dispatch(deleteResumeSuccess(updatedProfile));
      syncAuthenticatedUser(updatedProfile);
      showToast.success("Resume removed");
    } catch (resumeError) {
      dispatch(
        deleteResumeFailure(
          resumeError.response?.data?.message || resumeError.message,
        ),
      );
      showToast.error(
        resumeError.response?.data?.message || "Unable to remove your resume",
      );
    }
  };

  if (isLoading) return <Loader />;
  if (error || !profile)
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3] px-5 text-center text-[#53615a]">
        We couldn&apos;t load your profile. Login again.
        <Link to="/login"/>
      </main>
    );
  const skills = profile.skills || [];
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f7f3] px-5 py-8 text-[#19221d] sm:px-8 lg:px-10 lg:py-12">
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-72 w-full bg-[radial-gradient(circle_at_15%_0%,rgba(216,235,218,0.8),transparent_55%),radial-gradient(circle_at_95%_5%,rgba(247,224,185,0.7),transparent_40%)]" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#238457]">
              Your workspace
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">
              Your profile, in focus.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#69766e]">
              Keep your details current so the right opportunities can find you.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#b8d4c2] px-4 text-sm font-bold text-[#16734f] transition hover:bg-[#f0f8f1]"
            >
              <FiArrowLeft /> Back to dashboard
            </Link>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={toggleEditor}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1f7a50] px-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(31,122,80,0.18)] transition hover:bg-[#185e3e]"
            >
              <FiEdit2 /> {isEditing ? "Close editor" : "Edit profile"}
            </motion.button>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="overflow-hidden rounded-3xl border border-[#dfe5df] bg-white shadow-[0_18px_45px_rgba(46,74,57,0.08)]"
        >
          <div className="h-28 bg-[#dcebdd] bg-[linear-gradient(120deg,rgba(31,122,80,0.18),transparent_45%,rgba(247,202,130,0.4))] sm:h-36" />
          <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-[#e5f3eb] shadow-lg sm:h-32 sm:w-32">
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={`${profile.fullName} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser className="m-auto h-full w-12 text-[#1f7a50]" />
                  )}
                  <button
                    type="button"
                    title="Change profile photo"
                    aria-label="Change profile photo"
                    disabled={isBusy}
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute inset-x-0 bottom-0 flex h-9 items-center justify-center bg-[#19221d]/75 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100 disabled:cursor-not-allowed"
                  >
                    <FiCamera />
                  </button>
                  {isUploadingPhoto && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 text-xs font-bold text-[#16734f]"
                      role="status"
                      aria-live="polite"
                    >
                      <FiLoader className="animate-spin text-lg" />
                      Uploading photo
                    </div>
                  )}
                </div>
                <div>
                  <span className="inline-flex rounded-full bg-[#e5f3eb] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#16734f]">
                    {profile.role || "Job seeker"}
                  </span>
                  <h2 className="mt-2 font-serif text-3xl">
                    {profile.fullName || "Your name"}
                  </h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-[#69766e]">
                    <FiMail className="text-[#238457]" /> {profile.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={changePhoto}
                  className="hidden"
                />
                {profile.profilePhoto && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={removePhoto}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#f0c9c3] px-3 text-xs font-bold text-[#b44f43] hover:bg-[#fff3f1] disabled:opacity-50"
                  >
                    <FiTrash2 /> Remove photo
                  </button>
                )}
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => photoInputRef.current?.click()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#b8d4c2] px-3 text-xs font-bold text-[#16734f] hover:bg-[#f0f8f1] disabled:opacity-50"
                >
                  {isUploadingPhoto ? (
                    <>
                      <FiLoader className="animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload /> Photo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-[#dfe5df] bg-white p-5 shadow-[0_12px_30px_rgba(46,74,57,0.05)] sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                  About you
                </p>
                <h3 className="mt-2 font-serif text-2xl">Personal details</h3>
              </div>
              <FiUser className="text-2xl text-[#b8d4c2]" />
            </div>
            {isEditing ? (
              <form
                onSubmit={handleSubmit(saveProfile)}
                className="mt-7 space-y-5"
              >
                <Input
                  id="fullName"
                  label="Full name"
                  error={errors.fullName}
                  {...register("fullName")}
                />
                <Input
                  id="phone"
                  label="Phone"
                  error={errors.phone}
                  {...register("phone")}
                />
                <label
                  htmlFor="bio"
                  className="flex flex-col gap-2 text-sm font-bold text-[#53615a]"
                >
                  Bio
                  <textarea
                    id="bio"
                    rows="4"
                    className={`w-full resize-y rounded-xl border bg-white p-3 text-sm text-[#19221d] outline-none transition focus:border-[#1f7a50] focus:ring-4 focus:ring-[#d9eddf] ${errors.bio ? "border-[#c34e42]" : "border-[#d7e0d8]"}`}
                    {...register("bio")}
                  />
                  {errors.bio && (
                    <p className="text-xs font-medium text-[#c34e42]">
                      {errors.bio.message}
                    </p>
                  )}
                </label>
                <Input
                  id="skills"
                  label="Skills (comma separated)"
                  error={errors.skills}
                  {...register("skills")}
                />
                <button
                  disabled={isBusy}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f7ca82] px-5 text-sm font-bold text-[#213128] hover:bg-[#ffda9c] disabled:opacity-50"
                >
                  <FiCheck /> {isUpdating ? "Saving..." : "Save changes"}
                </button>
              </form>
            ) : (
              <div className="mt-7">
                <p className="max-w-2xl text-[15px] leading-7 text-[#53615a]">
                  {profile.bio ||
                    "Add a short introduction to help employers get to know you."}
                </p>
                <div className="mt-6 grid gap-4 border-y border-[#edf0eb] py-5 sm:grid-cols-2">
                  <p className="flex items-center gap-3 text-sm text-[#53615a]">
                    <FiPhone className="text-[#238457]" />{" "}
                    {profile.phone || "Phone not added"}
                  </p>
                  <p className="flex items-center gap-3 text-sm text-[#53615a]">
                    <FiMail className="text-[#238457]" /> {profile.email}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {skills.length ? (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[#f0f6ef] px-3 py-1.5 text-xs font-semibold text-[#276746]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#819087]">
                      No skills added yet.
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-[#dfe5df] bg-[#fffaf0] p-5 shadow-[0_12px_30px_rgba(124,87,35,0.06)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b76a17]">
                  Career document
                </p>
                <h3 className="mt-2 font-serif text-2xl">Your resume</h3>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7e3bd] text-[#a9651c]">
                <FiFileText size={21} />
              </span>
            </div>
            {profile.resume ? (
              <div className="mt-8 rounded-2xl border border-[#f1dfbd] bg-white p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <FiFileText className="shrink-0 text-xl text-[#b76a17]" />
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 truncate text-sm font-bold text-[#53615a] underline decoration-[#f1c982] underline-offset-4"
                  >
                    {profile.resumeOriginalName || "View your resume"}
                  </a>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => resumeInputRef.current?.click()}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1f7a50] px-3 text-xs font-bold text-white hover:bg-[#185e3e] disabled:opacity-50"
                  >
                    <FiEdit2 /> Replace
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={removeResume}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#f0c9c3] px-3 text-xs font-bold text-[#b44f43] hover:bg-[#fff3f1] disabled:opacity-50"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => resumeInputRef.current?.click()}
                className="mt-8 flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e8c98e] bg-white/60 px-4 text-center hover:border-[#b76a17] hover:bg-white disabled:opacity-50"
              >
                <FiPlus className="text-2xl text-[#b76a17]" />
                <span className="mt-2 text-sm font-bold text-[#8f5b1d]">
                  Add your resume
                </span>
                <span className="mt-1 text-xs text-[#9c8b70]">
                  PDF files up to 5 MB
                </span>
              </button>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={changeResume}
              className="hidden"
            />
          </motion.section>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
