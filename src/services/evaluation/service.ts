import apiClient from '@/lib/axios';
import { EvaluationApiResponse, CompleteEvaluationResponse, EvaluationHistoryResponse } from './types';

/**
 * Evaluate complete user profile (not tied to a specific resume)
 */
export const evaluateCompleteProfile = async (): Promise<EvaluationApiResponse<CompleteEvaluationResponse>> => {
  try {
    const response = await apiClient.post<EvaluationApiResponse<CompleteEvaluationResponse>>('/api/v1/evaluation/complete');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to evaluate complete profile';
    throw new Error(message);
  }
};

/**
 * Evaluate specific area of user profile
 */
export const evaluateProfileArea = async (
  evaluationArea: 'user_profile' | 'experience' | 'education'
): Promise<EvaluationApiResponse<CompleteEvaluationResponse>> => {
  try {
    const response = await apiClient.post<EvaluationApiResponse<CompleteEvaluationResponse>>(`/api/v1/evaluation/area/${evaluationArea}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to evaluate profile area';
    throw new Error(message);
  }
};

/**
 * Evaluate complete resume by ID
 */
export const evaluateCompleteResume = async (
  resumeId: string
): Promise<EvaluationApiResponse<CompleteEvaluationResponse>> => {
  try {
    const response = await apiClient.post<EvaluationApiResponse<CompleteEvaluationResponse>>(`/api/v1/evaluation/resume/${resumeId}/complete`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to evaluate complete resume';
    throw new Error(message);
  }
};

/**
 * Evaluate specific area of a resume
 */
export const evaluateResumeArea = async (
  resumeId: string,
  evaluationArea: 'user_profile' | 'experience' | 'education'
): Promise<EvaluationApiResponse<CompleteEvaluationResponse>> => {
  try {
    const response = await apiClient.post<EvaluationApiResponse<CompleteEvaluationResponse>>(`/api/v1/evaluation/resume/${resumeId}/area/${evaluationArea}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to evaluate resume area';
    throw new Error(message);
  }
};

/**
 * Get evaluation history for the authenticated user
 */
export const getEvaluationHistory = async (
  evaluationArea?: 'user_profile' | 'experience' | 'education'
): Promise<EvaluationHistoryResponse> => {
  try {
    const params = evaluationArea ? { evaluation_area: evaluationArea } : {};
    const response = await apiClient.get<EvaluationHistoryResponse>('/api/v1/evaluation/history', { params });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to get evaluation history';
    throw new Error(message);
  }
};

/**
 * Get available evaluation areas
 */
export const getEvaluationAreas = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>('/api/v1/evaluation/areas');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to get evaluation areas';
    throw new Error(message);
  }
};
