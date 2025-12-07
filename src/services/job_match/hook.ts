import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createJobMatch, getJobMatchHistory } from './service';
import { CreateJobMatchResponse, JobMatchHistoryResponse, JobMatchRequest } from './types';
import { isTokenLimitError } from '@/utils/error-utils';

export const useCreateJobMatch = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateJobMatchResponse, Error, JobMatchRequest>({
    mutationFn: (payload) => createJobMatch(payload),
    onSuccess: () => {
      toast.success('Job match created successfully');
      queryClient.invalidateQueries({ queryKey: ['job-match-history'] });
      // Refresh token balance after successful operation
      queryClient.invalidateQueries({ queryKey: ['token-balance'] });
    },
    onError: (err) => {
      // Check if it's a token limit error
      if (isTokenLimitError(err)) {
        toast.error("You don't have enough tokens to use this feature. Please check your token balance.");
        // Refresh token balance to show updated balance
        queryClient.invalidateQueries({ queryKey: ['token-balance'] });
      } else {
        toast.error(err.message);
      }
    }
  });
};

export const useJobMatchHistory = (page: number = 1, pageSize: number = 10) => {
  return useQuery<JobMatchHistoryResponse, Error>({
    queryKey: ['job-match-history', page, pageSize],
    queryFn: () => getJobMatchHistory({ page, page_size: pageSize }),
    staleTime: 60 * 1000,
  });
};


