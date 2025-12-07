import apiClient from '@/lib/axios';
import { TokenBalanceApiResponse } from './types';

/**
 * Get the current user's token balance
 * @returns Token balance information
 */
export const getTokenBalance = async (): Promise<TokenBalanceApiResponse> => {
  try {
    const res = await apiClient.get<TokenBalanceApiResponse>('/api/v1/tokens/balance');
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch token balance';
    throw new Error(message);
  }
};

