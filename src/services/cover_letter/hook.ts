import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createCoverLetter, getCoverLetterHistory, getCoverLetterById } from './service';
import { CreateCoverLetterResponse, CoverLetterHistoryResponse, CoverLetterRequest, GetCoverLetterResponse } from './types';
import { isTokenLimitError } from '@/utils/error-utils';

export const useCreateCoverLetter = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCoverLetterResponse, Error, CoverLetterRequest>({
    mutationFn: (payload) => createCoverLetter(payload),
    onSuccess: () => {
      toast.success('Cover letter generated successfully');
      queryClient.invalidateQueries({ queryKey: ['cover-letter-history'] });
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

export const useCoverLetterHistory = (page: number = 1, pageSize: number = 10) => {
  return useQuery<CoverLetterHistoryResponse, Error>({
    queryKey: ['cover-letter-history', page, pageSize],
    queryFn: () => getCoverLetterHistory({ page, page_size: pageSize }),
    staleTime: 60 * 1000,
  });
};

export const useGetCoverLetter = (id: string) => {
  return useQuery<GetCoverLetterResponse, Error>({
    queryKey: ['cover-letter', id],
    queryFn: () => getCoverLetterById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};
