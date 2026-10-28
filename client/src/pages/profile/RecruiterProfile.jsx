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
  FiMail,
  FiPhone,
  FiUser,
  FiUpload,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import RecruiterDashboardSidebar from "../../components/dashboard/RecruiterDashboardSidebar";
import Input from "../../components/ui/Input";
import Loader from "../../components/common/Loader";
import {
  clearProfile,
  profileFailure,
  profilePhotoFailure,
  profilePhotoStart,
  profilePhotoSuccess,
  profileStart,
  profileSuccess,
  updateProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
} from "../../redux/slices/profileSlice";
import { setUser } from "../../redux/slices/authSlice";
import {
  getUserProfile,
  updateProfile,
  updateProfilePhoto,
} from "../../service/userProfile.service";
import showToast from "../../utils/toast";
import { ProfileSchema } from "../../validations/ProfileSchema";

const getData = (response) => response?.data ?? response;

const RecruiterProfile = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const {
    profile,
    isLoading,
    error,
    isUpdating,
    isUploadingPhoto,
  } = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const photoInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { fullName: "", phone: "", bio: "", skills: "" },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(clearProfile());
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

  const startEditing = () => {
    reset({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      bio: profile.bio || "",
      skills: (profile.skills || []).join(", "),
    });
    setIsEditing(true);
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
      dispatch(setUser({ ...authUser, ...updatedProfile }));
      setIsEditing(false);
      showToast.success("Profile details updated");
    } catch (saveError) {
      const message =
        saveError.response?.data?.message || "Unable to update your profile";
      dispatch(updateProfileFailure(message));
      showToast.error(message);
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
      const formData = new FormData();
      formData.append("profilePhoto", file);
      const updatedProfile = getData(await updateProfilePhoto(formData));
      dispatch(profilePhotoSuccess(updatedProfile));
      dispatch(setUser({ ...authUser, ...updatedProfile }));
      showToast.success("Profile photo updated");
    } catch (photoError) {
      const message =
        photoError.response?.data?.message || "Unable to update your photo";
      dispatch(profilePhotoFailure(message));
      showToast.error(message);
    }
  };

  if (isLoading) return <Loader />;
  if (!profile)
    return (
      <div className="flex min-h-screen bg-[#f1f5ed]">
        <RecruiterDashboardSidebar />
        <main className="flex min-h-screen flex-1 items-center justify-center px-5 text-center text-[#53615a]">
          <div>
            <p>{error || "We couldn't load your profile."}</p>
            <Link
              to="/recruiter-dashboard"
              className="mt-4 inline-flex font-bold text-[#1f7a50] hover:underline"
            >
              Back to dashboard
            </Link>
          </div>
        </main>
      </div>
    );

  const skills = profile.skills || [];
  const completedFields = [
    Boolean(profile.fullName?.trim()),
    Boolean(profile.email?.trim()),
    Boolean(profile.phone?.trim()),
    Boolean(profile.bio?.trim()),
    Boolean(profile.profilePhoto?.trim()),
    Boolean(skills.some((skill) => skill.trim())),
  ].filter(Boolean).length;
  const profileCompletion = Math.round((completedFields / 6) * 100);
  const isBusy = isUpdating || isUploadingPhoto;

  return (
    <div className="flex min-h-screen bg-[#f1f5ed] text-[#19221d]">
      <RecruiterDashboardSidebar />
      <main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.header
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                Recruiter workspace
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                Your recruiter profile.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#69766e]">
                Keep your details current so candidates and hiring teams know
                who they are working with.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              <Link
                to="/recruiter-dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#b8d4c2] px-4 text-sm font-bold text-[#16734f] transition hover:bg-[#f0f8f1]"
              >
                <FiArrowLeft /> Back to dashboard
              </Link>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={isEditing ? () => setIsEditing(false) : startEditing}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1f7a50] px-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(31,122,80,0.18)] transition hover:bg-[#185e3e]"
              >
                <FiEdit2 /> {isEditing ? "Close editor" : "Edit profile"}
              </motion.button>
            </div>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-3xl border border-[#dfe5df] bg-white p-5 shadow-[0_12px_30px_rgba(46,74,57,0.05)] sm:p-7"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                  Profile completeness
                </p>
                <h2 className="mt-2 font-serif text-2xl">
                  {profileCompletion}% complete
                </h2>
                <p className="mt-1 text-sm text-[#69766e]">
                  {completedFields} of 6 profile details are filled in.
                </p>
              </div>
              {profileCompletion < 100 && !isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    startEditing();
                    document.getElementById("recruiter-profile-details")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[#b8d4c2] px-4 text-sm font-bold text-[#16734f] transition hover:bg-[#f0f8f1]"
                >
                  Complete your profile
                </button>
              )}
            </div>
            <div
              className="mt-5 h-2 overflow-hidden rounded-full bg-[#e6ede7]"
              role="progressbar"
              aria-label="Profile completeness"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={profileCompletion}
            >
              <div
                className="h-full rounded-full bg-[#1f7a50] transition-[width] duration-700"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </motion.section>

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
                        className="absolute inset-0 flex items-center justify-center bg-white/85 text-sm font-bold text-[#16734f]"
                        role="status"
                      >
                        Uploading...
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="inline-flex rounded-full bg-[#e5f3eb] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#16734f]">
                      Recruiter
                    </span>
                    <h2 className="mt-2 font-serif text-3xl">
                      {profile.fullName || "Your name"}
                    </h2>
                    <p className="mt-1 flex items-center gap-2 text-sm text-[#69766e]">
                      <FiMail className="text-[#238457]" /> {profile.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={changePhoto}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => photoInputRef.current?.click()}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#b8d4c2] px-3 text-xs font-bold text-[#16734f] hover:bg-[#f0f8f1] disabled:opacity-50"
                  >
                    {isUploadingPhoto ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <FiUpload /> Update photo
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            id="recruiter-profile-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-3xl border border-[#dfe5df] bg-white p-5 shadow-[0_12px_30px_rgba(46,74,57,0.05)] sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#238457]">
                  About you
                </p>
                <h3 className="mt-2 font-serif text-2xl">Profile details</h3>
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
                  label="Recruiting specialties (comma separated)"
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
                  {profile.bio || "Add a short introduction to your profile."}
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
                      No recruiting specialties added yet.
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default RecruiterProfile;
