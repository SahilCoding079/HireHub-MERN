import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],
  pagination: {
    totalJobs: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 10,
  },
  selectedJob: null,
  isLoading: false,
  detailLoading: false,
  error: null,
  detailError: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    jobListStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    jobListSuccess: (state, action) => {
      state.isLoading = false;
      state.jobs = action.payload.data || [];
      state.pagination = action.payload.pagination || initialState.pagination;
    },
    jobListFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    jobDetailStart: (state) => {
      state.detailLoading = true;
      state.detailError = null;
      state.selectedJob = null;
    },
    jobDetailSuccess: (state, action) => {
      state.detailLoading = false;
      state.selectedJob = action.payload;
    },
    jobDetailFailure: (state, action) => {
      state.detailLoading = false;
      state.detailError = action.payload;
    },
    clearJobDetail: (state) => {
      state.selectedJob = null;
      state.detailError = null;
    },
  },
});

export const {
  jobListStart,
  jobListSuccess,
  jobListFailure,
  jobDetailStart,
  jobDetailSuccess,
  jobDetailFailure,
  clearJobDetail,
} = jobSlice.actions;

export default jobSlice.reducer;