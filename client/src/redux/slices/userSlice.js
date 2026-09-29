import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboard: null,
  isLoading: false,
  error: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    dashboardStart: (state) => {
      state.isLoading = true;
      state.error = null
    },
    dashboardSuccess: (state, action) => {
      state.isLoading = false;
      state.dashboard = action.payload;
    },
    dashboardFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload
    },
    clearDashboard: (state) => {
      state.dashboard = null;
    }
  }
});

export const {
  dashboardStart,
  dashboardSuccess,
  dashboardFailure,
  clearDashboard
} = userSlice.actions;

export default userSlice.reducer;