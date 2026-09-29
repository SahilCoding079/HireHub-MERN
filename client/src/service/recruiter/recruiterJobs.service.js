import api from "../../api/axios";

export const getRecruiterJobs = async ({ page = 1, limit = 10 } = {}) => {
  const response = await api.get("/private/job", { params: { page, limit } });
  return response.data;
};

export const createRecruiterJob = async (jobData) => {
  const response = await api.post("/private/job", jobData);
  return response.data;
};

export const getRecruiterJob = async (jobId) => {
  const response = await api.get(`/private/job/${jobId}`);
  return response.data;
};

export const updateRecruiterJob = async (jobId, jobData) => {
  const response = await api.patch(`/private/job/${jobId}`, jobData);
  return response.data;
};

export const deleteRecruiterJob = async (jobId) => {
  const response = await api.delete(`/private/job/${jobId}`);
  return response.data;
};

export const getAllApplicants = async (jobId) => {
  const response = await api.get(`/private/applications/job/${jobId}`);
  return response.data;
};

export const getApplicantDetails = async (applicationId) => {
  const response = await api.get(`/private/applications/${applicationId}`);
  return response.data;
};

export const updateApplicantStatus = async (applicationId, status) => {
  const response = await api.patch(`/private/applications/${applicationId}/status`, { status });
  return response.data;
};

export const scheduleApplicantInterview = async (applicationId, interviewData) => {
  const response = await api.patch(
    `/private/applications/${applicationId}/interview`,
    interviewData,
  );
  return response.data;
};
