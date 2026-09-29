import api from "../api/axios.js"

export const registerUser = async(formData) => {
  const response = await api.post("/auth/register", formData);
  return response.data;
};
export const loginUser = async(credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};
export const logoutUser = async() => {
  const response = await api.post("/auth/logout");
  return response.data;
};
export const getUser = async() => {
  const response = await api.get("/auth/me");
  return response.data;
};
export const requestPasswordReset = async(email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};
export const resetPassword = async(credentials) => {
  const response = await api.post("/auth/reset-password", credentials);
  return response.data;
};