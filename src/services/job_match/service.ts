import apiClient from '@/lib/axios';
import { CreateJobMatchResponse, JobMatchHistoryResponse, JobMatchRequest } from './types';
import { handleServiceError } from '@/utils/error-utils';

export const createJobMatch = async (payload: JobMatchRequest): Promise<CreateJobMatchResponse> => {
  try {
    const res = await apiClient.post<CreateJobMatchResponse>('/api/v1/job-match/', payload);
    return res.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.create_failed', 'job_match');
  }
};

export const getJobMatchHistory = async (params: { page?: number; page_size?: number } = {}): Promise<JobMatchHistoryResponse> => {
  try {
    const res = await apiClient.get<JobMatchHistoryResponse>('/api/v1/job-match/history', { params });
    return res.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.fetch_failed', 'job_match');
  }
};


