import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  isLoading: false,
  isLoaded: false,
  error: null,
  actionId: "",
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notificationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    notificationsSuccess: (state, action) => {
      state.isLoading = false;
      state.isLoaded = true;
      state.notifications = action.payload.data || [];
    },
    notificationsFailure: (state, action) => {
      state.isLoading = false;
      state.isLoaded = false;
      state.error = action.payload;
    },
    notificationActionStart: (state, action) => {
      state.actionId = action.payload;
      state.error = null;
    },
    notificationMarkedRead: (state, action) => {
      state.actionId = "";
      state.notifications = state.notifications.map((notification) =>
        notification._id === action.payload
          ? { ...notification, isRead: true }
          : notification,
      );
    },
    allNotificationsMarkedRead: (state) => {
      state.actionId = "";
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
    },
    notificationRemoved: (state, action) => {
      state.actionId = "";
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload,
      );
    },
    allNotificationsRemoved: (state) => {
      state.actionId = "";
      state.notifications = [];
    },
    notificationActionFailure: (state, action) => {
      state.actionId = "";
      state.error = action.payload;
    },
    notificationsCleared: () => initialState,
  },
});

export const {
  notificationsStart,
  notificationsSuccess,
  notificationsFailure,
  notificationActionStart,
  notificationMarkedRead,
  allNotificationsMarkedRead,
  notificationRemoved,
  allNotificationsRemoved,
  notificationActionFailure,
  notificationsCleared,
} = notificationSlice.actions;

export default notificationSlice.reducer;