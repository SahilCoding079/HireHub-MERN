import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData : null,
  isLoading: false,
  error: null
}
const recruiterDashboardSlice = createSlice({
  name: "recruiterDashboard",
  initialState,
  reducers: {
    recruiterDashboardStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    recruiterDashboardSuccess: (state, action) => {
      state.isLoading = false;
      state.dashboardData = action.payload;
    },
    recruiterDashboardFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearRecruiterDashboard: (state) => {
      state.dashboardData = null;
      state.isLoading = false;
      state.error = false;
    }
  }
});
export const {
  recruiterDashboardStart,
  recruiterDashboardSuccess,
  recruiterDashboardFailure,
  clearRecruiterDashboard
} = recruiterDashboardSlice.actions;
export default recruiterDashboardSlice.reducer;