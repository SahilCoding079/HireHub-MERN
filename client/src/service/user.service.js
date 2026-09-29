import api from "../api/axios"

export const getUserDashboard = async() => {
  const response = await api.get("/dashboard/user");
  return response.data;
};