import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSubmitting: false,
  error: null,
  lastScheduledInterview: null,
};

const interviewScheduleSlice = createSlice({
  name: "interviewSchedule",
  initialState,
  reducers: {
    interviewScheduleStart: (state) => {
      state.isSubmitting = true;
      state.error = null;
    },
    interviewScheduleSuccess: (state, action) => {
      state.isSubmitting = false;
      state.lastScheduledInterview = action.payload.data?.interview || null;
    },
    interviewScheduleFailure: (state, action) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    clearInterviewScheduleError: (state) => {
      state.error = null;
    },
  },
});

export const {
  interviewScheduleStart,
  interviewScheduleSuccess,
  interviewScheduleFailure,
  clearInterviewScheduleError,
} = interviewScheduleSlice.actions;

export default interviewScheduleSlice.reducer;