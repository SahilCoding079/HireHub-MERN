import api from "../api/axios"

export const getUserProfile = async() => {
  const response = await api.get("/users/profile");
  return response.data;
};
export const updateProfile = async(profileData) => {
  const response = await api.patch("/users/profile", profileData);
  return response.data;
};
export const updateProfilePhoto = async(formData) => {
  const response = await api.patch("/users/profile/photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  )
  return response.data;
};
export const uploadResume = async(formData) => {
  const response = await api.post("/users/profile/resume", formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data;
};
export const deleteResume = async() => {
  const response = await api.delete("/users/profile/resume")
  return response.data;
};
export const deleteProfilePhoto = async() => {
  const response = await api.delete("/users/profile/photo");
  return response.data;
};