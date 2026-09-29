import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiHome,
  FiUser,
  FiX,
  FiBell,
  FiLock,
} from "react-icons/fi";
import { PiUsersThree } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import HireHubLogo from "../common/HireHubLogo";

const navigation = [
  { label: "Overview", path: "/recruiter-dashboard", icon: FiGrid },
  { label: "Companies", path: "/recruiter-companies", icon: FiHome },
  { label: "My Jobs", path: "/recruiter-jobs", icon: FiBriefcase },
  { label: "Applicants", path: "/recruiter-applicants", icon: PiUsersThree },
  { label: "Profile", path: "/recruiter-profile", icon: FiUser },
  { label: "Change password", path: "/change-password", icon: FiLock },
  { label: "Notifications", path: "/notifications", icon: FiBell },
];

const RecruiterDashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const hasUnreadNotifications = useSelector(
    (state) => state.notifications.notifications.some((notification) => !notification.isRead),
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close dashboard menu" : "Open dashboard menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#cbd9ce] bg-[#f8f7f3] text-[#1f7a50] shadow-sm md:hidden"
      >
        {isOpen ? <FiX size={21} /> : <FiMenu size={21} />}
      </button>
      {isOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-[#19221d]/30 md:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(84vw,280px)] flex-col border-r border-[#dfe5df] bg-[#f8f7f3] px-5 py-6 transition-transform duration-300 md:static md:z-auto md:w-64 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <NavLink to="/" className="block" onClick={() => setIsOpen(false)}>
          <HireHubLogo />
        </NavLink>

        <p className="mt-12 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9aa49d]">
          Workspace
        </p>

        <nav className="mt-4 flex flex-col gap-1">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={`${label}-${path}`}
              to={path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${isActive ? "bg-[#e5f3eb] text-[#1f7a50]" : "text-[#69766e] hover:bg-white hover:text-[#1f7a50]"}`
              }
            >
              <Icon size={18} />
              <span className="flex items-center gap-2">
                {label}
                {label === "Notifications" && hasUnreadNotifications && (
                  <span
                    className="h-2 w-2 rounded-full bg-[#c34e42]"
                    aria-label="Unread notifications"
                    title="Unread notifications"
                  />
                )}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#dfe5df] pt-5">
          <div className="flex items-center gap-3 px-2">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7ca82] text-sm font-bold text-[#66502e]">
                {user?.fullName?.charAt(0)?.toUpperCase() || "H"}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#19221d]">{user?.fullName || "HireHub recruiter"}</p>
              <p className="truncate text-xs text-[#819087]">{user?.email || "Recruiting team"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#c34e42] transition hover:bg-[#fbe3e0]"
          >
            <FiLogOut size={18} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default RecruiterDashboardSidebar;