import Input from "../../components/ui/Input";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../../validations/RegisterSchema";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiBriefcase,
  FiCheck,
  FiImage,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { FadeIn } from "../../components/motion/Motion";
import { registerUser } from "../../service/auth.service.js";
import HireHubLogo from "../../components/common/HireHubLogo";
import { useDispatch, useSelector } from "react-redux";
import {
  registerFaliure,
  registerStart,
  registerSuccess,
} from "../../redux/slices/authSlice.js";
import showToast from "../../utils/toast.js";
import Loader from "../../components/common/Loader.jsx";

const Register = () => {
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  const {
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting, isValid, errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      profilePhoto: undefined,
    },
  });
  const [previewUrl, setPreviewUrl] = useState("");
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profilePhotoField = register("profilePhoto");
  const handlePhotoChange = (event) => {
    profilePhotoField.onChange(event);
    const file = event.target.files?.[0];
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const onSubmit = async (data) => {
    dispatch(registerStart());
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      if (data.profilePhoto?.[0]) {
        formData.append("profilePhoto", data.profilePhoto[0]);
      }
      const response = await registerUser(formData);
      dispatch(registerSuccess(response.data));
      showToast.success(
        response.message || "Registration successful.",
        "success",
      );
      navigate(
        response.data.role === "recruiter"
          ? "/recruiter-dashboard"
          : "/dashboard",
      );
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      dispatch(registerFaliure());
      showToast.error(message, "error");
    }
    reset();
  };
  if (isLoading) return <Loader />;
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#f1f5ed] px-5 py-10 text-[#19221d] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_90%,rgba(216,235,218,0.85),transparent_28%),radial-gradient(circle_at_92%_12%,rgba(247,224,185,0.55),transparent_25%)]" />
      <section className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-4xl border border-[#d7e0d8] bg-[#f8f7f3] shadow-[0_24px_70px_rgba(46,74,57,0.12)] md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex w-full flex-col justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-16">
          <FadeIn>
            <div className="mb-8 flex flex-col space-y-5">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1f7a50] hover:text-[#185e3e]"
              >
                <FiArrowLeft /> Back to home
              </Link>
              <HireHubLogo compact />
              <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                Create your space.
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#69766e]">
                Build a profile that helps the right opportunities find you.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            >
              <Input
                type="text"
                id="fullName"
                autoComplete="name"
                {...register("fullName")}
                error={errors.fullName}
                placeholder="Enter your full name"
                label="Full Name"
              />
              <Input
                type="email"
                id="email"
                autoComplete="email"
                {...register("email")}
                error={errors.email}
                placeholder="Enter your email"
                label="Email Address"
              />
              <Input
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password")}
                error={errors.password}
                placeholder="Create a password"
                label="Password"
                onToggleVisibility={() => setVisiblePasswords((current) => ({ ...current, password: !current.password }))}
                isPasswordVisible={visiblePasswords.password}
              />
              <Input
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                {...register("confirmPassword")}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                label="Confirm Password"
                onToggleVisibility={() => setVisiblePasswords((current) => ({ ...current, confirmPassword: !current.confirmPassword }))}
                isPasswordVisible={visiblePasswords.confirmPassword}
              />
              <div className="flex min-w-0 flex-col gap-2 sm:col-span-2">
                <label
                  htmlFor="role"
                  className="text-sm font-bold text-[#53615a]"
                >
                  Account Type
                </label>
                <select
                  id="role"
                  {...register("role")}
                  className={`w-full rounded-xl border bg-white px-3 py-3 text-sm text-[#19221d] outline-none transition duration-200 focus:border-[#1f7a50] focus:ring-4 focus:ring-[#d9eddf] ${errors.role ? "border-[#c34e42] focus:border-[#c34e42] focus:ring-[#fbe3e0]" : "border-[#d7e0d8]"}`}
                >
                  <option value="user">Job seeker</option>
                  <option value="recruiter">Recruiter</option>
                </select>
                {errors.role && (
                  <p className="text-xs font-medium text-[#c34e42]">
                    {errors.role.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-bold text-[#53615a]">
                  Profile photo{" "}
                  <span className="font-normal text-[#9aa49d]">(optional)</span>
                </p>
                <label
                  htmlFor="profilePhoto"
                  className={`group flex min-h-28 cursor-pointer items-center gap-4 rounded-2xl border border-dashed p-4 transition duration-200 ${previewUrl ? "border-[#b8d4c2] bg-[#e5f3eb]" : "border-[#b8d4c2] bg-[#f1f5ed] hover:border-[#1f7a50] hover:bg-[#e5f3eb]"}`}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Selected profile preview"
                      className="h-16 w-16 rounded-xl object-cover shadow-sm"
                    />
                  ) : (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-[#1f7a50] shadow-sm">
                      <FiImage size={23} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-[#19221d]">
                      {previewUrl
                        ? "Profile photo selected"
                        : "Add a profile photo"}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#819087]">
                      JPG, PNG or WEBP up to 5 MB. A clear photo helps teams put
                      a face to your profile.
                    </span>
                  </span>
                  {previewUrl ? (
                    <button
                      type="button"
                      aria-label="Remove selected profile photo"
                      onClick={(event) => {
                        event.preventDefault();
                        setPreviewUrl("");
                        document.getElementById("profilePhoto").value = "";
                      }}
                      className="rounded-lg p-2 text-[#c34e42] transition hover:bg-[#fbe3e0]"
                    >
                      <FiX size={18} />
                    </button>
                  ) : (
                    <span className="hidden items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#1f7a50] shadow-sm sm:inline-flex">
                      <FiUpload size={14} /> Browse
                    </span>
                  )}
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    {...profilePhotoField}
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1f7a50] text-sm font-bold text-white transition hover:bg-[#185e3e] focus:outline-none focus:ring-2 focus:ring-[#1f7a50] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "Registering..." : "Create account"}{" "}
                <FiArrowUpRight />
              </button>
            </form>
            <div className="mt-7 flex items-center justify-center gap-2 text-sm text-[#69766e]">
              <span>Already have an account?</span>
              <Link
                to="/login"
                className="font-bold text-[#1f7a50] hover:text-[#185e3e]"
              >
                Login
              </Link>
            </div>
          </FadeIn>
        </div>
        <motion.div
          className="relative hidden min-h-155 overflow-hidden md:block"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
        >
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&h=1600&q=85"
            alt="A diverse team working together"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(31,122,80,0.18),rgba(31,122,80,0.72)_70%,rgba(247,202,130,0.55))]" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <FiBriefcase size={26} className="text-[#f7ca82]" />
            <h2 className="mt-5 max-w-sm font-serif text-4xl leading-tight">
              Bring your whole self to work.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
              One thoughtful profile. More meaningful possibilities.
            </p>
            <div className="mt-7 flex items-center gap-2 text-xs font-bold text-[#d9eddf]">
              <FiCheck /> Join 12k+ people moving forward
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Register;
