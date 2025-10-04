import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { evaluateUnified } from './service';
import {
  EvaluationApiResponse,
  UnifiedEvaluationResponse,
  EvaluateRequest,
} from './types';

/**
 * Hook to evaluate resume or profile using unified endpoint
 */
export const useEvaluateUnified = () => {
  return useMutation<EvaluationApiResponse<UnifiedEvaluationResponse>, Error, EvaluateRequest>({
    mutationFn: evaluateUnified,
    onSuccess: (data) => {
      toast.success('Evaluation completed successfully!');
    },
    onError: (error) => {
      toast.error(`Evaluation failed: ${error.message}`);
    },
  });
};