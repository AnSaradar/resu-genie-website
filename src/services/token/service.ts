import apiClient from '@/lib/axios';
import { TokenBalanceApiResponse } from './types';
import { handleServiceError } from '@/utils/error-utils';

/**
 * Get the current user's token balance
 * @returns Token balance information
 */
export const getTokenBalance = async (): Promise<TokenBalanceApiResponse> => {
  try {
    const res = await apiClient.get<TokenBalanceApiResponse>('/api/v1/tokens/balance');
    return res.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.fetch_failed', 'token');
  }
};

