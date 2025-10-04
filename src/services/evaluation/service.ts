import apiClient from '@/lib/axios';
import { 
  EvaluationApiResponse, 
  UnifiedEvaluationResponse,
  EvaluateRequest
} from './types';

/**
 * Evaluate resume or profile using unified endpoint
 */
export const evaluateUnified = async (request: EvaluateRequest): Promise<EvaluationApiResponse<UnifiedEvaluationResponse>> => {
  try {
    const response = await apiClient.post<EvaluationApiResponse<UnifiedEvaluationResponse>>('/api/v1/evaluation/complete', request);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to evaluate';
    throw new Error(message);
  }
};