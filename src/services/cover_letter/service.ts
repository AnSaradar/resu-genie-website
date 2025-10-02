import apiClient from '@/lib/axios';
import { CreateCoverLetterResponse, CoverLetterHistoryResponse, CoverLetterRequest, GetCoverLetterResponse, CoverLetter, stringToCoverLetterTone } from './types';

export const createCoverLetter = async (payload: CoverLetterRequest): Promise<CreateCoverLetterResponse> => {
  try {
    const res = await apiClient.post<CreateCoverLetterResponse>('/api/v1/cover-letter/generate', payload);
    // Convert tone string to enum if needed
    if (res.data.cover_letter.tone && typeof res.data.cover_letter.tone === 'string') {
      res.data.cover_letter.tone = stringToCoverLetterTone(res.data.cover_letter.tone);
    }
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to create cover letter';
    throw new Error(message);
  }
};

export const getCoverLetterHistory = async (params: { page?: number; page_size?: number } = {}): Promise<CoverLetterHistoryResponse> => {
  try {
    const res = await apiClient.get<CoverLetterHistoryResponse>('/api/v1/cover-letter/history', { params });
    // Convert tone strings to enums if needed
    res.data.items = res.data.items.map((item: CoverLetter) => ({
      ...item,
      tone: item.tone && typeof item.tone === 'string' ? stringToCoverLetterTone(item.tone) : item.tone
    }));
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch cover letter history';
    throw new Error(message);
  }
};

export const getCoverLetterById = async (id: string): Promise<GetCoverLetterResponse> => {
  try {
    const res = await apiClient.get<GetCoverLetterResponse>(`/api/v1/cover-letter/${id}`);
    // Convert tone string to enum if needed
    if (res.data.cover_letter.tone && typeof res.data.cover_letter.tone === 'string') {
      res.data.cover_letter.tone = stringToCoverLetterTone(res.data.cover_letter.tone);
    }
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch cover letter';
    throw new Error(message);
  }
};
