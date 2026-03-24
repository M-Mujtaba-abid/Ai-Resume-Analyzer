export interface ParsedData {
  skills: string[];
  experience: string[];
  education: string[];
  university: string[];
  interest: string[];
  home_town: string;
  fyp: string;
  certifications: string[];
}

export interface InterviewQuestions {
  technical: string[];
  behavioral: string[];
}

export interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  suggestions: string[];
  keywordsMissing: string[];
  interviewQuestions: InterviewQuestions;
  parsedData: ParsedData;
}

export interface Resume {
  _id: string;
  owner: string;

  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;

  rawText: string;

  jobTitle: string;
  jobDescription: string;

  status: "processing" | "completed";

  analysis: ResumeAnalysis;

  createdAt: string;
  updatedAt: string;
}

export interface UploadResumeResponse {
  statusCode: number;
  data: Resume;
  message: string;
}

export interface AnalyzeResumeRequest {
  resumeId: string;
  jobDescription: string;
}

export interface AnalyzeResumeResponse {
  statusCode: number;
  data: Resume;
  message: string;
}

export interface AllAnalysesResponse {
  statusCode: number;
  data: Resume[]; // Array of Resume
  message: string;
  success: boolean;
}