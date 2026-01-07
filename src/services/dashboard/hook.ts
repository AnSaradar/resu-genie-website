import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from './service';
import { DashboardStatsResponse } from './types';

/**
 * Hook to fetch dashboard statistics
 */
export const useGetDashboardStats = () => {
  return useQuery<DashboardStatsResponse, Error>({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

