import api from "../api/axios"

export const saveJob = async(jobId) => {
  const response = await api.post(`/saved-jobs/${jobId}`);
  return response.data;
}
export const getSavedJobs = async(page = 1, limit = 10) => {
  const response = await api.get("/saved-jobs/me", {
    params: { page, limit },
  });
  return response.data;
}
export const deleteSavedJobs = async(jobId) => {
  const response = await api.delete(`/saved-jobs/${jobId}`);
  return response.data;
}