import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companies: [],
  isLoading: false,
  mutationLoading: false,
  error: null,
};

const recruiterCompaniesSlice = createSlice({
  name: "recruiterCompanies",
  initialState,
  reducers: {
    recruiterCompaniesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    recruiterCompaniesSuccess: (state, action) => {
      state.isLoading = false;
      state.companies = action.payload.data || [];
    },
    recruiterCompaniesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    recruiterCompanyMutationStart: (state) => {
      state.mutationLoading = true;
      state.error = null;
    },
    recruiterCompanyMutationSuccess: (state, action) => {
      state.mutationLoading = false;
      const company = action.payload.data;
      if (!company) return;
      const companyIndex = state.companies.findIndex((item) => item._id === company._id);
      if (companyIndex === -1) {
        state.companies.unshift(company);
      } else {
        state.companies[companyIndex] = company;
      }
    },
    recruiterCompanyMutationFailure: (state, action) => {
      state.mutationLoading = false;
      state.error = action.payload;
    },
    recruiterCompanyRemoved: (state, action) => {
      state.mutationLoading = false;
      state.companies = state.companies.filter((company) => company._id !== action.payload);
    },
  },
});

export const {
  recruiterCompaniesStart,
  recruiterCompaniesSuccess,
  recruiterCompaniesFailure,
  recruiterCompanyMutationStart,
  recruiterCompanyMutationSuccess,
  recruiterCompanyMutationFailure,
  recruiterCompanyRemoved,
} = recruiterCompaniesSlice.actions;

export default recruiterCompaniesSlice.reducer;
