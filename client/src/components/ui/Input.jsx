import { FiEye, FiEyeOff } from "react-icons/fi";

const Input = ({
  label,
  type = "text",
  placeholder,
  className,
  error,
  onToggleVisibility,
  isPasswordVisible = false,
  id,
  ...props
}) => {
  return (
    <div className="flex min-w-0 flex-col gap-2">
        <label htmlFor={id} className="text-sm font-bold text-[#53615a]">{label}</label>
        <div className="relative">
          <input
            {...props}
            type={onToggleVisibility ? (isPasswordVisible ? "text" : "password") : type}
            id={id}
            placeholder={placeholder}
            className={`w-full rounded-xl border bg-white px-3 py-3 ${onToggleVisibility ? "pr-11" : "pr-3"} text-sm text-[#19221d] outline-none transition duration-200 placeholder:text-[#9aa49d] focus:border-[#1f7a50] focus:ring-4 focus:ring-[#d9eddf] ${error ? "border-[#c34e42] focus:border-[#c34e42] focus:ring-[#fbe3e0]" : "border-[#d7e0d8]"} ${className || ""}`}
          />
          {onToggleVisibility && (
            <button
              type="button"
              onClick={onToggleVisibility}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              title={isPasswordVisible ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[#819087] transition hover:text-[#1f7a50] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1f7a50]"
            >
              {isPasswordVisible ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs font-medium text-[#c34e42]">{error.message}</p>}
    </div>
  );
};

export default Input;
