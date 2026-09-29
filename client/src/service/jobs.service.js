import api from "../api/axios";

export const getPublicJobs = async (params) => {
  const response = await api.get("/public/job", { params });
  return response.data;
};

export const searchJobs = async (params) => {
  const response = await api.get("/public/job/search", {params});
  return response.data;
};

export const getPublicJobById = async (id) => {
  const response = await api.get(`/public/job/${id}`);
  return response.data;
};

export const getPublicCompanies = async () => {
  const response = await api.get("/public/companies");
  return response.data;
};