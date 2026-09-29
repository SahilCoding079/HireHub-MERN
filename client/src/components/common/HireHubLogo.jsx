import { PiBagFill } from "react-icons/pi";

const HireHubLogo = ({ compact = false, className = "" }) => (
  <span className={`inline-flex items-center gap-2.5 text-[#19221d] ${className}`}>
    <span className={`flex shrink-0 items-center justify-center rounded-xl bg-[#1f7a50] text-[#f7ca82] shadow-[4px_4px_0_#d4e6d6] ${compact ? "h-8 w-8 rounded-lg" : "h-10 w-10"}`}>
      <PiBagFill size={compact ? 17 : 22} aria-hidden="true" />
    </span>
    <span className={`${compact ? "text-sm" : "text-2xl"} font-serif font-bold tracking-tight`}>HireHub<span className="text-[#238457]">.</span></span>
  </span>
);

export default HireHubLogo;