import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { evaluateUnified } from './service';
import {
  EvaluationApiResponse,
  UnifiedEvaluationResponse,
  EvaluateRequest,
} from './types';
import { isTokenLimitError } from '@/utils/error-utils';

/**
 * Hook to evaluate resume or profile using unified endpoint
 */
export const useEvaluateUnified = () => {
  const queryClient = useQueryClient();

  return useMutation<EvaluationApiResponse<UnifiedEvaluationResponse>, Error, EvaluateRequest>({
    mutationFn: evaluateUnified,
    onSuccess: (data) => {
      toast.success('Evaluation completed successfully!');
      // Refresh token balance after successful operation
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
    },
    onError: (error) => {
      // Check if it's a token limit error
      if (isTokenLimitError(error)) {
        toast.error("You don't have enough tokens to use this feature. Please check your token balance.");
        // Refresh token balance to show updated balance
        queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      } else {
        toast.error(`Evaluation failed: ${error.message}`);
      }
    },
  });
};