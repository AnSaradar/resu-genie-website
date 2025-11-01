import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { submitFeedback, getFeedbackTags } from './service';
import { FeedbackRequest, FeedbackResponse, FeedbackTagsResponse } from './types';

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation<FeedbackResponse, Error, FeedbackRequest>({
    mutationFn: (payload) => submitFeedback(payload),
    onSuccess: () => {
      toast.success('Thank you for your feedback!');
      // Optionally invalidate related queries
    },
    onError: (err) => {
      toast.error(`Failed to submit feedback: ${err.message}`);
    }
  });
};

export const useFeedbackTags = () => {
  return useQuery<FeedbackTagsResponse, Error>({
    queryKey: ['feedback-tags'],
    queryFn: getFeedbackTags,
    staleTime: 60 * 60 * 1000, // 1 hour - tags rarely change
  });
};

