import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: false,
  passwordResetLoading: false,
  passwordResetError: null,
  passwordResetMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = false;
    },
    logout: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.isInitialized = true;
    },
    setUser: (state, action) => {
      state.user = action.payload,
      state.isAuthenticated = true
    },
    initializeAuthStart: (state) => {
      state.isLoading = true
    },
    initializeAuthSuccess: (state, action) => {
      state.isLoading = false,
      state.isAuthenticated = true,
      state.isInitialized = true,
      state.user = action.payload
    },
    initializeAuthFailure: (state) => {
      state.isLoading = false,
      state.isAuthenticated = false,
      state.user = null,
      state.isInitialized = true
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = false;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    registerFaliure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload
    },
    passwordResetStart: (state) => {
      state.passwordResetLoading = true;
      state.passwordResetError = null;
      state.passwordResetMessage = null;
    },
    passwordResetSuccess: (state, action) => {
      state.passwordResetLoading = false;
      state.passwordResetMessage = action.payload;
    },
    passwordResetFailure: (state, action) => {
      state.passwordResetLoading = false;
      state.passwordResetError = action.payload;
    }
  },
});
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  initializeAuthStart,
  initializeAuthSuccess,
  initializeAuthFailure,
  registerStart,
  registerSuccess,
  registerFaliure,
  passwordResetStart,
  passwordResetSuccess,
  passwordResetFailure
} = authSlice.actions;

export default authSlice.reducer;