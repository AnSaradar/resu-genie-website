import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  evaluateCompleteProfile,
  evaluateProfileArea,
  evaluateCompleteResume,
  evaluateResumeArea,
  getEvaluationHistory,
  getEvaluationAreas,
} from './service';
import {
  EvaluationApiResponse,
  CompleteEvaluationResponse,
  EvaluationHistoryResponse,
  EvaluateResumeRequest,
  EvaluateProfileRequest,
} from './types';

/**
 * Hook to evaluate complete user profile
 */
export const useEvaluateCompleteProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<EvaluationApiResponse<CompleteEvaluationResponse>, Error, void>({
    mutationFn: evaluateCompleteProfile,
    onSuccess: (data) => {
      toast.success('Profile evaluation completed successfully!');
      // Invalidate evaluation history to refresh the list
      queryClient.invalidateQueries({ queryKey: ['evaluation-history'] });
    },
    onError: (error) => {
      toast.error(`Evaluation failed: ${error.message}`);
    },
  });
};

/**
 * Hook to evaluate specific area of user profile
 */
export const useEvaluateProfileArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation<EvaluationApiResponse<CompleteEvaluationResponse>, Error, EvaluateProfileRequest>({
    mutationFn: ({ evaluationType }) => evaluateProfileArea(evaluationType as any),
    onSuccess: (data) => {
      toast.success('Profile area evaluation completed successfully!');
      queryClient.invalidateQueries({ queryKey: ['evaluation-history'] });
    },
    onError: (error) => {
      toast.error(`Evaluation failed: ${error.message}`);
    },
  });
};

/**
 * Hook to evaluate complete resume by ID
 */
export const useEvaluateCompleteResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation<EvaluationApiResponse<CompleteEvaluationResponse>, Error, string>({
    mutationFn: (resumeId) => evaluateCompleteResume(resumeId),
    onSuccess: (data) => {
      toast.success('Resume evaluation completed successfully!');
      queryClient.invalidateQueries({ queryKey: ['evaluation-history'] });
    },
    onError: (error) => {
      toast.error(`Resume evaluation failed: ${error.message}`);
    },
  });
};

/**
 * Hook to evaluate specific area of a resume
 */
export const useEvaluateResumeArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation<EvaluationApiResponse<CompleteEvaluationResponse>, Error, EvaluateResumeRequest>({
    mutationFn: ({ resumeId, evaluationType }) => 
      evaluateResumeArea(resumeId, evaluationType as any),
    onSuccess: (data) => {
      toast.success('Resume area evaluation completed successfully!');
      queryClient.invalidateQueries({ queryKey: ['evaluation-history'] });
    },
    onError: (error) => {
      toast.error(`Resume area evaluation failed: ${error.message}`);
    },
  });
};

/**
 * Hook to get evaluation history
 */
export const useGetEvaluationHistory = (evaluationArea?: string) => {
  return useQuery<EvaluationHistoryResponse, Error>({
    queryKey: ['evaluation-history', evaluationArea],
    queryFn: () => getEvaluationHistory(evaluationArea as any),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get available evaluation areas
 */
export const useGetEvaluationAreas = () => {
  return useQuery<string[], Error>({
    queryKey: ['evaluation-areas'],
    queryFn: getEvaluationAreas,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Combined hook for resume evaluation with resume selection
 * This is the main hook that will be used in the ResumeEvaluator component
 */
export const useResumeEvaluation = () => {
  const evaluateCompleteResumeMutation = useEvaluateCompleteResume();
  const evaluateResumeAreaMutation = useEvaluateResumeArea();
  const evaluateCompleteProfileMutation = useEvaluateCompleteProfile();
  const evaluateProfileAreaMutation = useEvaluateProfileArea();
  
  const evaluateResume = async (
    resumeId: string | null,
    evaluationType: 'complete' = 'complete'
  ) => {
    if (resumeId) {
      // Evaluate specific resume
      return evaluateCompleteResumeMutation.mutateAsync(resumeId);
    } else {
      // Evaluate user profile (not tied to specific resume)
      return evaluateCompleteProfileMutation.mutateAsync();
    }
  };
  
  return {
    evaluateResume,
    isLoading: 
      evaluateCompleteResumeMutation.isPending ||
      evaluateResumeAreaMutation.isPending ||
      evaluateCompleteProfileMutation.isPending ||
      evaluateProfileAreaMutation.isPending,
    error: 
      evaluateCompleteResumeMutation.error ||
      evaluateResumeAreaMutation.error ||
      evaluateCompleteProfileMutation.error ||
      evaluateProfileAreaMutation.error,
  };
};
