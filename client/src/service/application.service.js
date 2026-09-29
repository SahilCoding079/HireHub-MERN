import api from "../api/axios"

export const getMyApplications = async() => {
  const response = await api.get("/applications/me");
  return response.data;
}
export const applyJob = async(jobId) => {
  const response = await api.post(`/applications/${jobId}`);
  return response.data;
}