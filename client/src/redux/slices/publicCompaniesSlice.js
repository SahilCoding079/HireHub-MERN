import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companies: [],
  isLoading: false,
  error: null,
};

const publicCompaniesSlice = createSlice({
  name: "publicCompanies",
  initialState,
  reducers: {
    publicCompaniesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    publicCompaniesSuccess: (state, action) => {
      state.isLoading = false;
      state.companies = action.payload || [];
    },
    publicCompaniesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  publicCompaniesStart,
  publicCompaniesSuccess,
  publicCompaniesFailure,
} = publicCompaniesSlice.actions;

export default publicCompaniesSlice.reducer;