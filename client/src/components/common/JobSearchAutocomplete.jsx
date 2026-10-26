
import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiLoader, FiMapPin } from "react-icons/fi";
import { searchJobs } from "../../service/jobs.service";

const extractJobs = (response) => {
  // Your current API format:
  // { success: true, data: [job1, job2, ...], pagination: {...} }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  // Also support an Axios response object, if one is returned.
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.jobs)) {
    return response.jobs;
  }

  if (Array.isArray(response?.data?.jobs)) {
    return response.data.jobs;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  return [];
};

const JobSearchAutocomplete = ({
  mode = "keyword",
  value = "",
  location = "",
  onChange,
  placeholder,
  ariaLabel,
  className = "",
  inputClassName = "",
}) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const listboxId = useId();

  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const isLocationMode = mode === "location";

  useEffect(() => {
    const query = value.trim();
    let cancelled = false;

    if (query.length < 2) {
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      setSuggestions([]);
      setIsLoading(true);
      setIsOpen(true);

      try {
        const params = {
          page: 1,
          limit: isLocationMode ? 20 : 5,
          ...(isLocationMode
            ? { location: query }
            : {
                keyword: query,
                ...(location.trim() ? { location: location.trim() } : {}),
              }),
        };

        console.log("[Autocomplete] Searching:", params);

        const response = await searchJobs(params);
        const jobs = extractJobs(response).filter((job) => job?._id);

        console.log("[Autocomplete] API response:", response);
        console.log("[Autocomplete] Parsed results:", {
          mode,
          query,
          count: jobs.length,
          titles: jobs.map((job) => job.title),
          locations: jobs.map((job) => job.location),
          cancelled,
        });

        if (cancelled) return;

        setActiveIndex(-1);

        if (isLocationMode) {
          const uniqueLocations = [
            ...new Set(
              jobs
                .map((job) => job.location?.trim())
                .filter(Boolean)
            ),
          ];

          setSuggestions(
            uniqueLocations.map((location) => ({
              value: location,
              label: location,
            }))
          );
        } else {
          setSuggestions(jobs);
        }

        setIsOpen(true);
      } catch (error) {
        console.error("[Autocomplete] Request failed:", {
          status: error.response?.status,
          response: error.response?.data,
          message: error.message,
        });

        if (!cancelled) {
          setSuggestions([]);
          setIsOpen(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [value, isLocationMode, location, mode]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  const selectSuggestion = (suggestion) => {
    if (isLocationMode) {
      onChange(suggestion.value);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!suggestion?._id) return;

    setIsOpen(false);
    setActiveIndex(-1);
    navigate(`/jobs/${suggestion._id}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!isOpen || isLoading || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current > 0 ? current - 1 : suggestions.length - 1
      );
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative min-w-0 ${className}`}
    >
      <input
        type="search"
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          onChange(nextValue);
          setSuggestions([]);
          setIsLoading(nextValue.trim().length >= 2);
          setIsOpen(nextValue.trim().length >= 2);
          setActiveIndex(-1);
        }}
        onFocus={() => {
          if (value.trim().length >= 2) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={
          placeholder ||
          (isLocationMode
            ? "Location or remote"
            : "Job title, skill or company")
        }
        aria-label={
          ariaLabel ||
          (isLocationMode
            ? "Search by location"
            : "Search by keyword")
        }
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && value.trim().length >= 2}
        aria-controls={listboxId}
        aria-activedescendant={
          activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
        }
        autoComplete="off"
        className={inputClassName}
      />

      {isOpen && value.trim().length >= 2 && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={
            isLocationMode ? "Location suggestions" : "Job suggestions"
          }
          className="absolute left-0 right-0 top-full z-[60] mt-2 max-h-80 min-w-64 overflow-y-auto rounded-xl border border-[#d7e0d8] bg-white py-2 text-[#19221d] shadow-[0_16px_40px_rgba(25,34,29,0.14)]"
        >
          {isLoading ? (
            <div
              className="flex items-center gap-2 px-4 py-3 text-sm text-[#69766e]"
              role="status"
            >
              <FiLoader className="animate-spin" />
              {isLocationMode
                ? "Finding locations..."
                : "Finding matching jobs..."}
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => {
              const key = isLocationMode
                ? suggestion.value
                : suggestion._id;

              const title = isLocationMode
                ? suggestion.label
                : suggestion.title;

              const secondaryText = isLocationMode
                ? "Search jobs in this location"
                : [
                    suggestion.company?.name ||
                      suggestion.companyName ||
                      "Company not listed",
                    suggestion.location,
                  ]
                    .filter(Boolean)
                    .join(" · ");

              return (
                <button
                  key={key}
                  id={`${listboxId}-${index}`}
                  type="button"
                  role="option"
                  aria-selected={activeIndex === index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                    activeIndex === index
                      ? "bg-[#e5f3eb]"
                      : "hover:bg-[#f1f5ed]"
                  }`}
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e5f3eb] text-[#1f7a50]">
                    {isLocationMode ? (
                      <FiMapPin size={17} />
                    ) : (
                      <FiBriefcase size={17} />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {title}
                    </span>

                    <span className="mt-1 block truncate text-xs text-[#69766e]">
                      {secondaryText}
                    </span>
                  </span>
                </button>
              );
            })
          ) : (
            <p className="px-4 py-3 text-sm text-[#69766e]">
              {isLocationMode
                ? "No matching locations found."
                : "No matching jobs found."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSearchAutocomplete;
