import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { PiBookmarkSimple, PiBookmarkSimpleFill } from "react-icons/pi";
import {
  savedJobMarked,
  savedJobMutationFailure,
  savedJobMutationStart,
  savedJobUnmarked,
} from "../../redux/slices/savedJobsSlice";
import { deleteSavedJobs, saveJob } from "../../service/savedJobs.service";
import showToast from "../../utils/toast";

const SaveJobButton = ({ jobId, className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { savedJobIds, mutationJobId } = useSelector((state) => state.savedJobs);
  const isSaved = savedJobIds.includes(jobId);
  const isMutating = mutationJobId === jobId;

  const handleSave = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated || !user) {
      showToast.error("Please log in to save jobs.");
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }
    if (user.role !== "user") {
      showToast.error("Only job seekers can save jobs.");
      return;
    }

    dispatch(savedJobMutationStart(jobId));
    try {
      const response = isSaved
        ? await deleteSavedJobs(jobId)
        : await saveJob(jobId);
      if (isSaved) {
        dispatch(savedJobUnmarked(jobId));
      } else {
        dispatch(savedJobMarked(jobId));
      }
      showToast.success(
        response.message || (isSaved ? "Job removed from saved jobs." : "Job saved successfully."),
      );
    } catch (requestError) {
      dispatch(
        savedJobMutationFailure(
          requestError.response?.data?.message || "Unable to update saved jobs.",
        ),
      );
      showToast.error(
        requestError.response?.data?.message || "Unable to update saved jobs.",
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={isMutating}
      aria-label={isSaved ? "Remove job from saved jobs" : "Save job"}
      aria-pressed={isSaved}
      title={isSaved ? "Remove from saved jobs" : "Save job"}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#cbd9ce] bg-white text-[#1f7a50] transition hover:bg-[#e5f3eb] disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      {isSaved ? <PiBookmarkSimpleFill size={20} /> : <PiBookmarkSimple size={20} />}
    </button>
  );
};

export default SaveJobButton;
