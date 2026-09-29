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
  selectedApplicant: null,
  applicants: [],
  isLoading: false,
  detailLoading: false,
  mutationLoading: false,
  applicantsLoading: false,
  error: null,
  detailError: null,
  applicantsError: null,
};

const recruiterJobsSlice = createSlice({
  name: "recruiterJobs",
  initialState,
  reducers: {
    recruiterJobsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    recruiterJobsSuccess: (state, action) => {
      state.isLoading = false;
      state.jobs = action.payload.data || [];
      state.pagination = action.payload.pagination || initialState.pagination;
    },
    recruiterJobsAppendSuccess: (state, action) => {
      state.isLoading = false;
      state.jobs = [...state.jobs, ...(action.payload.data || [])];
      state.pagination = action.payload.pagination || state.pagination;
    },
    recruiterJobsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    recruiterJobDetailStart: (state) => {
      state.detailLoading = true;
      state.detailError = null;
    },
    recruiterJobDetailSuccess: (state, action) => {
      state.detailLoading = false;
      state.selectedJob = action.payload.data || action.payload;
    },
    recruiterJobDetailFailure: (state, action) => {
      state.detailLoading = false;
      state.detailError = action.payload;
    },
    recruiterJobMutationStart: (state) => {
      state.mutationLoading = true;
      state.error = null;
    },
    recruiterJobMutationSuccess: (state) => {
      state.mutationLoading = false;
    },
    recruiterJobMutationFailure: (state, action) => {
      state.mutationLoading = false;
      state.error = action.payload;
    },
    recruiterJobRemoved: (state, action) => {
      state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      state.pagination.totalJobs = Math.max(0, state.pagination.totalJobs - 1);
    },
    recruiterCompanyUpdated: (state, action) => {
      const company = action.payload;
      state.jobs = state.jobs.map((job) =>
        job.company?._id === company._id
          ? { ...job, company: { ...job.company, ...company } }
          : job,
      );
    },
    recruiterApplicantsStart: (state) => {
      state.applicantsLoading = true;
      state.applicantsError = null;
    },
    recruiterApplicantsSuccess: (state, action) => {
      state.applicantsLoading = false;
      state.applicants = action.payload.data || [];
    },
    recruiterApplicantsFailure: (state, action) => {
      state.applicantsLoading = false;
      state.applicantsError = action.payload;
    },
    recruiterApplicantStatusSuccess: (state, action) => {
      const updatedApplication = action.payload.data || action.payload;
      const applicantIndex = state.applicants.findIndex(
        (application) => application._id === updatedApplication._id,
      );
      if (applicantIndex !== -1) {
        state.applicants[applicantIndex] = {
          ...state.applicants[applicantIndex],
          ...updatedApplication,
        };
      }
      if (state.selectedApplicant?._id === updatedApplication._id) {
        state.selectedApplicant = {
          ...state.selectedApplicant,
          ...updatedApplication,
        };
      }
    },
    recruiterApplicantDetailStart: (state) => {
      state.detailLoading = true;
      state.detailError = null;
    },
    recruiterApplicantDetailSuccess: (state, action) => {
      state.detailLoading = false;
      state.selectedApplicant = action.payload.data || action.payload;
    },
    recruiterApplicantDetailFailure: (state, action) => {
      state.detailLoading = false;
      state.detailError = action.payload;
    },
    clearRecruiterJobDetail: (state) => {
      state.selectedJob = null;
      state.detailError = null;
      state.selectedApplicant = null;
    },
    clearRecruiterApplicants: (state) => {
      state.applicants = [];
      state.applicantsError = null;
    },
  },
});

export const {
  recruiterJobsStart,
  recruiterJobsSuccess,
  recruiterJobsAppendSuccess,
  recruiterJobsFailure,
  recruiterJobDetailStart,
  recruiterJobDetailSuccess,
  recruiterJobDetailFailure,
  recruiterJobMutationStart,
  recruiterJobMutationSuccess,
  recruiterJobMutationFailure,
  recruiterJobRemoved,
  recruiterCompanyUpdated,
  recruiterApplicantsStart,
  recruiterApplicantsSuccess,
  recruiterApplicantsFailure,
  recruiterApplicantStatusSuccess,
  recruiterApplicantDetailStart,
  recruiterApplicantDetailSuccess,
  recruiterApplicantDetailFailure,
  clearRecruiterJobDetail,
  clearRecruiterApplicants,
} = recruiterJobsSlice.actions;

export default recruiterJobsSlice.reducer;