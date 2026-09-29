import Input from "../../components/ui/Input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoginSchema } from "../../validations/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../../service/auth.service.js";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../redux/slices/authSlice.js";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiArrowLeft, FiArrowUpRight, FiBriefcase, FiCheck } from "react-icons/fi";
import { FadeIn } from "../../components/motion/Motion";
import showToast from "../../utils/toast.js";
import HireHubLogo from "../../components/common/HireHubLogo";

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const onSubmit = async (formData) => {
    dispatch(loginStart());
    try {
      const response = await loginUser(formData);
      dispatch(loginSuccess(response.data));
      showToast.success("Login successfull.");
      navigate(
        location.state?.from ||
          (response.data.role === "recruiter"
            ? "/recruiter-dashboard"
            : "/dashboard"),
        { replace: true },
      );
    } catch (error) {
      showToast.error(error.response?.message || error.message);
      dispatch(loginFailure());
    }
    reset();
  };
  return (
    <>
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#f1f5ed] px-5 py-10 text-[#19221d] sm:px-8 lg:px-10">
      
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(216,235,218,0.85),transparent_28%),radial-gradient(circle_at_90%_85%,rgba(247,224,185,0.55),transparent_25%)]" />
      
      <section className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-4xl border border-[#d7e0d8] bg-[#f8f7f3] shadow-[0_24px_70px_rgba(46,74,57,0.12)] md:grid-cols-[0.9fr_1.1fr]">
        
        <motion.div
          className="relative hidden min-h-155 overflow-hidden md:block"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
        >
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&h=1600&q=85"
            alt="Professionals collaborating around a table"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(31,122,80,0.82),rgba(31,122,80,0.16)_65%,rgba(247,202,130,0.45))]" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <FiBriefcase size={26} className="text-[#f7ca82]" />
            <h2 className="mt-5 max-w-sm font-serif text-4xl leading-tight">
              Your next chapter starts here.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
              Discover work that fits your ambition, your rhythm, and your life.
            </p>
            <div className="mt-7 flex items-center gap-2 text-xs font-bold text-[#d9eddf]">
              <FiCheck /> 34,280 opportunities and counting
            </div>
          </div>
        </motion.div>
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
                Welcome back.
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#69766e]">
                Sign in to pick up where your next opportunity begins.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <Input
                type="email"
                id="login-email"
                {...register("email")}
                error={errors.email}
                placeholder="Enter your email"
                label="Email Address"
              />
              <Input
                type="password"
                id="login-password"
                {...register("password")}
                error={errors.password}
                placeholder="Enter your password"
                label="Password"
                onToggleVisibility={() => setIsPasswordVisible((visible) => !visible)}
                isPasswordVisible={isPasswordVisible}
              />
              <div className="text-right">
                <Link
                  to="/change-password"
                  className="text-sm font-bold text-[#1f7a50] hover:text-[#185e3e]"
                >
                  Change password
                </Link>
              </div>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1f7a50] text-sm font-bold text-white transition hover:bg-[#185e3e] focus:outline-none focus:ring-2 focus:ring-[#1f7a50] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "Logging In" : "Login"} <FiArrowUpRight />
              </button>
            </form>
            
            <div className="mt-7 flex justify-center items-center gap-2 text-sm text-[#69766e]">
              <span>Don't have an account?</span>
              <Link
                to="/register"
                className="font-bold text-[#1f7a50] hover:text-[#185e3e]"
              >
                Register
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
    </>
  );
};

export default Login;
