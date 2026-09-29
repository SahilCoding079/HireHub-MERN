import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b8d4c2] bg-[#1f7a50] text-white shadow-[0_8px_20px_rgba(31,122,80,0.22)] transition-all duration-300 hover:bg-[#185e3e] focus:outline-none focus:ring-2 focus:ring-[#1f7a50] focus:ring-offset-2 sm:bottom-8 sm:right-8 ${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"} cursor-pointer`}
    >
      <FiArrowUp size={19} aria-hidden="true" />
    </button>
  );
};

export default ScrollToTop;
