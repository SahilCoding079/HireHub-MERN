import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  applications: [],
  isLoading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    applicationStart: (state) => {
      state.isLoading = true;
      state.error = null
    },
    applicationSuccess: (state, action) => {
      state.isLoading = false;
      state.applications = action.payload;
    },
    applicationFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearApplication: (state) => {
      state.error = null;
      state.applications = []
    }
  }
});

export const {
  applicationStart,
  applicationSuccess,
  applicationFailure,
  clearApplication
} = applicationSlice.actions;
export default applicationSlice.reducer;