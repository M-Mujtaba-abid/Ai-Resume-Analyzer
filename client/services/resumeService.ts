import { AllAnalysesResponse } from "@/types/resumeTypes";
import { api } from "./api";


export const uploadResume = async (formData: FormData) => {
  const res = await api.post("/resume/upload", formData, { withCredentials: true });
  return res.data;
};

export const analyzeResume = async (data: {
  resumeId: string;
  jobDescription: string;
  jobTitle: string;
}) => {
  const res = await api.post("/resume/atsAnalyzer", data, { withCredentials: true });
  return res.data;
};

export const getResumeById = async (id: string) => {
  const res = await api.get(`/resume/getAnalysisResult/${id}`, { withCredentials: true });
  return res.data;
};

export const getAllUserAnalyses = async (): Promise<AllAnalysesResponse> => {
  const res = await api.get("/resume/getAllUserAnalyses", { withCredentials: true });
  return res.data;
};
