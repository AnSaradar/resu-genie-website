import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTokenBalance } from './service';
import { TokenBalanceApiResponse } from './types';

/**
 * Hook to fetch and manage token balance
 */
export const useTokenBalance = () => {
  return useQuery<TokenBalanceApiResponse, Error>({
    queryKey: ['token-balance'],
    queryFn: getTokenBalance,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true,
  });
};

/**
 * Helper hook to refresh token balance
 */
export const useRefreshTokenBalance = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['token-balance'] });
  };
};

