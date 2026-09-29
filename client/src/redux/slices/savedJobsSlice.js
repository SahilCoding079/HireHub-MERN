import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedJobs: [],
  savedJobIds: [],
  pagination: {
    totalSavedJobs: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 10,
  },
  isLoading: false,
  mutationJobId: null,
  error: null,
};

const getJobId = (savedJob) =>
  typeof savedJob?.job === "string" ? savedJob.job : savedJob?.job?._id;

const getUniqueJobIds = (savedJobs) => [
  ...new Set(savedJobs.map(getJobId).filter(Boolean)),
];

const savedJobsSlice = createSlice({
  name: "savedJobs",
  initialState,
  reducers: {
    savedJobsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    savedJobsSuccess: (state, action) => {
      const response = action.payload.response || action.payload;
      const { data = [], pagination } = response;
      const shouldAppend = action.payload.append || action.meta?.append;
      state.isLoading = false;
      state.savedJobs = shouldAppend ? [...state.savedJobs, ...data] : data;
      state.savedJobIds = getUniqueJobIds(state.savedJobs);
      state.pagination = pagination || initialState.pagination;
    },
    savedJobsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    savedJobMutationStart: (state, action) => {
      state.mutationJobId = action.payload;
      state.error = null;
    },
    savedJobMarked: (state, action) => {
      if (!state.savedJobIds.includes(action.payload)) {
        state.savedJobIds.push(action.payload);
      }
      state.mutationJobId = null;
    },
    savedJobUnmarked: (state, action) => {
      state.savedJobIds = state.savedJobIds.filter(
        (jobId) => jobId !== action.payload,
      );
      state.savedJobs = state.savedJobs.filter(
        (savedJob) => getJobId(savedJob) !== action.payload,
      );
      state.pagination.totalSavedJobs = Math.max(
        0,
        state.pagination.totalSavedJobs - 1,
      );
      state.mutationJobId = null;
    },
    savedJobMutationFailure: (state, action) => {
      state.mutationJobId = null;
      state.error = action.payload;
    },
    clearSavedJobs: () => initialState,
  },
});

export const {
  savedJobsStart,
  savedJobsSuccess,
  savedJobsFailure,
  savedJobMutationStart,
  savedJobMarked,
  savedJobUnmarked,
  savedJobMutationFailure,
  clearSavedJobs,
} = savedJobsSlice.actions;

export default savedJobsSlice.reducer;
