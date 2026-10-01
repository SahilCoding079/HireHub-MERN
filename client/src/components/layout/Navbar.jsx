import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { FiArrowUpRight, FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import HireHubLogo from "../common/HireHubLogo";
import { logout } from "../../redux/slices/authSlice";
import { logoutUser } from "../../service/auth.service";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized, user } = useSelector((state) => state.auth);
  const showLogout = isInitialized && isAuthenticated && Boolean(user);

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Find jobs", path: "/jobs" },
    { name: "About", path: "/about" },
  ];
  const memberLinks = [
    { name: "Home", path: "/" },
    { name: "Find jobs", path: "/jobs" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "My applications", path: "/my-applications" },
    { name: "Saved jobs", path: "/saved-jobs" },
    { name: "My profile", path: "/user-profile" },
  ];

  const links = showLogout ? memberLinks : publicLinks;

  const handleLogout = async () => {
    await logoutUser().catch(() => undefined);
    dispatch(logout());
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe5df] bg-[#f1f5ed]/95 shadow-[0_5px_20px_rgba(46,74,57,0.05)] backdrop-blur-md">
      <div className="mx-auto flex min-h-19 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <NavLink to="/" className="group shrink-0" aria-label="HireHub home">
          <span className="flex flex-col items-start gap-1">
            <HireHubLogo className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="ml-0.5 flex h-1.5 w-18 items-center gap-1 overflow-hidden" aria-hidden="true">
              {[
                { color: "bg-[#1f7a50]", width: "w-8", scale: "group-hover:scale-x-100 group-focus-visible:scale-x-100" },
                { color: "bg-[#f0b866]", width: "w-5", scale: "group-hover:scale-x-[1.3] group-focus-visible:scale-x-[1.3]" },
                { color: "bg-[#9bc9a9]", width: "w-3", scale: "group-hover:scale-x-[1.6] group-focus-visible:scale-x-[1.6]" },
              ].map((line) => (
                <span
                  key={line.color}
                  className={`block h-1 origin-left scale-x-50 rounded-full opacity-70 transition duration-500 ease-in-out will-change-transform group-hover:opacity-100 group-focus-visible:opacity-100 ${line.width} ${line.color} ${line.scale}`}
                  style={{ transformOrigin: "left center" }}
                />
              ))}
            </span>
          </span>
        </NavLink>

        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#cbd9ce] bg-white text-[#19221d] transition hover:border-[#1f7a50] hover:text-[#1f7a50] focus:outline-none focus:ring-2 focus:ring-[#1f7a50] md:hidden"
        >
          {isOpen ? <IoMdClose size={24} /> : <RxHamburgerMenu size={24} />}
        </button>

        <nav className="hidden w-full flex-col gap-6 md:flex md:w-auto md:flex-row md:items-center">
          <ul className="flex flex-col gap-3 text-sm font-semibold text-[#53615a] md:flex-row md:items-center md:gap-5 lg:gap-7">
            {links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "relative block py-2 text-[#1f7a50] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#f0b866] after:content-['']"
                      : "block py-2 transition-colors duration-200 hover:text-[#1f7a50]"
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {showLogout ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c34e42] px-4 py-2.5 text-sm font-bold text-white transition duration-200 hover:bg-[#a83f35] focus:outline-none focus:ring-2 focus:ring-[#c34e42] focus:ring-offset-2 md:text-base"
              >
                Logout <FiLogOut size={16} />
              </button>
            ) : (
              <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f7a50] px-4 py-2.5 text-sm font-bold text-white transition duration-200 hover:bg-[#185e3e] hover:shadow-[0_5px_12px_rgba(31,122,80,0.2)] focus:outline-none focus:ring-2 focus:ring-[#1f7a50] focus:ring-offset-2 md:text-base">
                Get started <FiArrowUpRight size={16} />
              </Link>
            )}
          </div>
        </nav>
      </div>

      <div
          className={`overflow-hidden border-t border-[#dfe5df] bg-[#f8f7f3] transition-[max-height,opacity] duration-300 md:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8">
          <ul className="flex flex-col gap-1 text-sm font-semibold text-[#53615a] sm:text-base">
            {links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "block rounded-xl bg-[#e5f3eb] px-4 py-3 text-[#1f7a50] sm:text-lg"
                      : "block rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-white hover:text-[#1f7a50] sm:text-lg"
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 border-t border-[#dfe5df] pt-4 sm:flex-row">
            {showLogout ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c34e42] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#a83f35] sm:text-base"
              >
                Logout <FiLogOut size={17} />
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="inline-flex w-full items-center justify-center rounded-xl border border-[#b8d4c2] bg-white px-4 py-3 text-sm font-bold text-[#1f7a50] transition hover:border-[#1f7a50] sm:text-base">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f7a50] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#185e3e] sm:text-base">
                  Get started <FiArrowUpRight size={17} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
