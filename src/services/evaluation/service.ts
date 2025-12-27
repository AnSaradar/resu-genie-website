import apiClient from '@/lib/axios';
import { 
  EvaluationApiResponse, 
  UnifiedEvaluationResponse,
  EvaluateRequest
} from './types';
import { handleServiceError } from '@/utils/error-utils';

/**
 * Evaluate resume or profile using unified endpoint
 */
export const evaluateUnified = async (request: EvaluateRequest): Promise<EvaluationApiResponse<UnifiedEvaluationResponse>> => {
  try {
    const response = await apiClient.post<EvaluationApiResponse<UnifiedEvaluationResponse>>('/api/v1/evaluation/complete', request);
    return response.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.operation_failed', 'evaluation');
  }
};