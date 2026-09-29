import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import HireHubLogo from "../common/HireHubLogo";

const Footer = () => {
  return (
    <footer className="bg-[#16352a] text-[#f8f7f3]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" aria-label="HireHub home" className="inline-flex">
              <HireHubLogo className="rounded-xl bg-[#f8f7f3] p-1.5 pr-3" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#c3d2c7]">
              Find meaningful work and build the teams shaping what comes next.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                ["LinkedIn", "https://www.linkedin.com/", FiLinkedin],
                ["Instagram", "https://www.instagram.com/", FiInstagram],
                ["X", "https://x.com/", FiTwitter],
                ["GitHub", "https://github.com/", FiGithub],
              ].map(([label, href, Icon]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`HireHub on ${label}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#466757] text-[#dce9df] transition hover:border-[#f7ca82] hover:bg-[#234737] hover:text-[#f7ca82]"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#f7ca82]">
              Explore
            </h2>
            <nav className="mt-5 flex flex-col items-start gap-3 text-sm text-[#c3d2c7]">
              <Link className="transition hover:text-white" to="/find-job">Find jobs</Link>
              <Link className="transition hover:text-white" to="/about">About us</Link>
              <Link className="transition hover:text-white" to="/contact">Contact</Link>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#f7ca82]">
              For members
            </h2>
            <nav className="mt-5 flex flex-col items-start gap-3 text-sm text-[#c3d2c7]">
              <Link className="transition hover:text-white" to="/dashboard">Dashboard</Link>
              <Link className="transition hover:text-white" to="/my-applications">My applications</Link>
              <Link className="transition hover:text-white" to="/saved-jobs">Saved jobs</Link>
              <Link className="transition hover:text-white" to="/user-profile">My profile</Link>
            </nav>
          </div>

          <div className="rounded-2xl border border-[#b8d4c2] bg-[#e5f3eb] p-5 text-[#19221d] shadow-[8px_8px_0_#f7ca82]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1f7a50]">
              Keep moving
            </p>
            <h2 className="mt-3 font-serif text-2xl text-[#19221d]">
              Your next opportunity is out there.
            </h2>
            <Link
              to="/find-job"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1f7a50] transition hover:text-[#185e3e]"
            >
              Browse open roles <FiArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#466757] pt-5 text-xs text-[#a9beb0] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} HireHub. All rights reserved.</p>
          <div className="flex gap-5">
            <Link className="transition hover:text-white" to="/contact">Help center</Link>
            <Link className="transition hover:text-white" to="/about">Our story</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
