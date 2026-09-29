import api from "../../api/axios";

export const getRecruiterCompanies = async () => {
  const response = await api.get("/private/companies");
  return response.data;
};

export const createRecruiterCompany = async (companyData) => {
  const response = await api.post("/private/companies", companyData);
  return response.data;
};

export const updateRecruiterCompany = async (companyId, companyData) => {
  const response = await api.patch(`/private/companies/${companyId}`, companyData);
  return response.data;
};

export const deleteRecruiterCompany = async (companyId) => {
  const response = await api.delete(`/private/companies/${companyId}`);
  return response.data;
};
