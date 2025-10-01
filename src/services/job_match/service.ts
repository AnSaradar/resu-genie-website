import apiClient from '@/lib/axios';
import { CreateJobMatchResponse, JobMatchHistoryResponse, JobMatchRequest } from './types';

export const createJobMatch = async (payload: JobMatchRequest): Promise<CreateJobMatchResponse> => {
  try {
    const res = await apiClient.post<CreateJobMatchResponse>('/api/v1/job-match/', payload);
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to create job match';
    throw new Error(message);
  }
};

export const getJobMatchHistory = async (params: { page?: number; page_size?: number } = {}): Promise<JobMatchHistoryResponse> => {
  try {
    const res = await apiClient.get<JobMatchHistoryResponse>('/api/v1/job-match/history', { params });
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch job match history';
    throw new Error(message);
  }
};


