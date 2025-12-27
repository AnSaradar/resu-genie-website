import apiClient from '@/lib/axios';
import { handleServiceError } from '@/utils/error-utils';

export type ActivityItem = {
  _id: string;
  user_id: string;
  type: string;
  context?: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
};

export const getMyActivityFeed = async (limit = 10): Promise<ActivityItem[]> => {
  try {
    const res = await apiClient.get('/api/v1/activity/feed', { params: { limit } });
    return res.data.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.fetch_failed', 'activity');
  }
};


