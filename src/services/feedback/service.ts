import axios from 'axios';
import { FeedbackRequest, FeedbackResponse, FeedbackTagsResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const submitFeedback = async (payload: FeedbackRequest): Promise<FeedbackResponse> => {
  const response = await axios.post<FeedbackResponse>(
    `${API_BASE_URL}/api/v1/feedback/`,
    payload,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const getFeedbackTags = async (): Promise<FeedbackTagsResponse> => {
  const response = await axios.get<FeedbackTagsResponse>(
    `${API_BASE_URL}/api/v1/feedback/tags`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

