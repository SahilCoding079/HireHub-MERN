import { FiArrowUpRight } from "react-icons/fi";
import { StaggerItem } from "../motion/Motion";

const StatCard = ({ label, value, icon: Icon, tone }) => (
  <StaggerItem className="rounded-2xl border border-[#e2e7e1] bg-white p-5 shadow-[0_8px_24px_rgba(46,74,57,0.04)]">
    <div className="flex items-start justify-between">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone || "bg-[#e5f3eb] text-[#16734f]"}`}>
        {Icon ? <Icon size={19} /> : null}
      </span>
      <FiArrowUpRight className="text-[#9aa49d]" />
    </div>
    <p className="mt-7 font-serif text-4xl text-[#19221d]">{value}</p>
    <p className="mt-1 text-sm font-semibold text-[#819087]">{label}</p>
  </StaggerItem>
);

export default StatCard;