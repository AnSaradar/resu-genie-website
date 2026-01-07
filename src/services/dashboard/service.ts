import apiClient from '@/lib/axios';
import { handleServiceError } from '@/utils/error-utils';
import { DashboardStatsResponse } from './types';

/**
 * Fetch dashboard statistics for the current user.
 * Endpoint: GET /api/v1/resume/dashboard-stats
 */
export const fetchDashboardStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response = await apiClient.get<DashboardStatsResponse>('/api/v1/resume/dashboard-stats');
    return response.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.fetch_failed', 'dashboard');
  }
};

