import api from "../../api/axios"

export const getRecruiterService = async() => {
  const response = await api.get("/dashboard/recruiter");
  return response.data;
}