import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  isLoading: false,
  isUpdating: false,
  isUploadingPhoto: false,
  isUploadingResume: false,
  isDeletingResume: false,
  isDeletingPhoto: false,
  error: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    //Get profile
    profileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    profileSuccess: (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
    },
    profileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    //Update profile
    updateProfileStart: (state) => {
      state.isUpdating = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      state.isUpdating = false;
    },
    updateProfileFailure: (state, action) => {
      state.error = action.payload;
      state.isUpdating = false;
    },

    //Update profile photo
    profilePhotoStart: (state) => {
      state.isUploadingPhoto = true;
      state.error = null;
    },
    profilePhotoSuccess: (state, action) => {
      state.isUploadingPhoto = false;
      state.profile = { ...state.profile, ...action.payload };
    },
    profilePhotoFailure: (state, action) => {
      state.isUploadingPhoto = false;
      state.error = action.payload;
    },

    //Resume upload
    resumeUploadStart: (state) => {
      state.isUploadingResume = true;
      state.error = null;
    },
    resumeUploadSuccess: (state, action) => {
      state.isUploadingResume = false;
      state.profile = { ...state.profile, ...action.payload };
    },
    resumeUploadFailure: (state, action) => {
      state.isUploadingResume = false;
      state.error = action.payload;
    },

    //Delete resume
    deleteResumeStart: (state) => {
      state.isDeletingResume = true;
      state.error = null;
    },
    deleteResumeSuccess: (state, action) => {
      state.isDeletingResume = false;
      state.profile = { ...state.profile, ...action.payload };
    },
    deleteResumeFailure: (state, action) => {
      state.isDeletingResume = false;
      state.error = action.payload;
    },
    deletePhotoStart: (state) => {
      state.isDeletingPhoto = true;
      state.error = null;
    },
    deletePhotoSuccess: (state, action) => {
      state.isDeletingPhoto = false;
      state.profile = { ...state.profile, ...action.payload };
    },
    deletePhotoFailure: (state, action) => {
      state.isDeletingPhoto = false;
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.isLoading = false;
      state.profile = null;
      state.isUpdating = false;
      state.error = null;
    }
  },
});
export const {
  profileStart,
  profileSuccess,
  profileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  profilePhotoStart,
  profilePhotoSuccess,
  profilePhotoFailure,
  resumeUploadStart,
  resumeUploadSuccess,
  resumeUploadFailure,
  deleteResumeStart,
  deleteResumeSuccess,
  deleteResumeFailure,
  deletePhotoStart,
  deletePhotoSuccess,
  deletePhotoFailure,
  clearProfile
} = profileSlice.actions;
export default profileSlice.reducer;