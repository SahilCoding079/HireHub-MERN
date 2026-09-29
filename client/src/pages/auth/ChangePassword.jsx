import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft, FiArrowUpRight, FiLock } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/ui/Input";
import HireHubLogo from "../../components/common/HireHubLogo";
import { FadeIn } from "../../components/motion/Motion";
import { requestPasswordReset, resetPassword } from "../../service/auth.service";
import {
  PasswordResetRequestSchema,
  PasswordResetSchema,
} from "../../validations/ChangePasswordSchema";
import showToast from "../../utils/toast";
import {
  passwordResetFailure,
  passwordResetStart,
  passwordResetSuccess,
} from "../../redux/slices/authSlice";

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const isResetMode = Boolean(token);
  const dispatch = useDispatch();
  const { passwordResetLoading, passwordResetError, passwordResetMessage } = useSelector((state) => state.auth);
  const [visiblePasswords, setVisiblePasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(isResetMode ? PasswordResetSchema : PasswordResetRequestSchema),
    mode: "onChange",
    defaultValues: { email: "", newPassword: "", confirmPassword: "" },
  });

  const togglePassword = (field) => {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  };

  const onSubmit = async (values) => {
    dispatch(passwordResetStart());
    try {
      if (isResetMode) {
        await resetPassword({ email: values.email, token, newPassword: values.newPassword });
        dispatch(passwordResetSuccess("Password reset successfully. Please log in."));
        showToast.success("Password reset successfully. Please log in.");
        navigate("/login", { replace: true });
        return;
      }
      await requestPasswordReset(values.email);
      dispatch(passwordResetSuccess("If an account exists, a reset link has been sent to your email."));
      reset();
      showToast.success("If an account exists, a reset link has been sent to your email.");
    } catch (error) {
      const message = error.response?.data?.message || "Unable to process your password request.";
      dispatch(passwordResetFailure(message));
      showToast.error(message);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#f1f5ed] px-5 py-10 text-[#19221d] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(216,235,218,0.85),transparent_28%),radial-gradient(circle_at_90%_85%,rgba(247,224,185,0.55),transparent_25%)]" />
      <section className="relative mx-auto w-full max-w-xl rounded-4xl border border-[#d7e0d8] bg-[#f8f7f3] px-5 py-8 shadow-[0_24px_70px_rgba(46,74,57,0.12)] sm:px-10 sm:py-12">
        <FadeIn>
          <div className="mb-8 flex flex-col space-y-5">
            <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-bold text-[#1f7a50] hover:text-[#185e3e]"><FiArrowLeft /> Back</button>
            <HireHubLogo compact />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{isResetMode ? "Set a new password." : "Forgot your password?"}</h1>
                <p className="mt-3 text-sm leading-6 text-[#69766e]">{isResetMode ? "Choose a strong new password for your HireHub account." : "Enter your email and we will send you a secure reset link."}</p>
              </div>
              <span className="mt-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e5f3eb] text-[#1f7a50]"><FiLock size={21} /></span>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input id="email" type="email" autoComplete="email" {...register("email")} error={errors.email} placeholder="Enter your email" label="Email address" />
            {isResetMode && (
              <>
                <Input id="newPassword" type="password" autoComplete="new-password" {...register("newPassword")} error={errors.newPassword} placeholder="Create a new password" label="New password" onToggleVisibility={() => togglePassword("newPassword")} isPasswordVisible={visiblePasswords.newPassword} />
                <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} error={errors.confirmPassword} placeholder="Confirm your new password" label="Confirm new password" onToggleVisibility={() => togglePassword("confirmPassword")} isPasswordVisible={visiblePasswords.confirmPassword} />
              </>
            )}
            {passwordResetError && <p className="text-sm font-medium text-[#c34e42]" role="alert">{passwordResetError}</p>}
            {passwordResetMessage && !isResetMode && <p className="text-sm font-medium text-[#1f7a50]" role="status">{passwordResetMessage}</p>}
            <button type="submit" disabled={isSubmitting || passwordResetLoading || !isValid} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1f7a50] text-sm font-bold text-white transition hover:bg-[#185e3e] focus:outline-none focus:ring-2 focus:ring-[#1f7a50] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting || passwordResetLoading ? "Processing..." : isResetMode ? "Reset password" : "Send reset link"} <FiArrowUpRight /></button>
          </form>
        </FadeIn>
      </section>
    </main>
  );
};

export default ChangePassword;
