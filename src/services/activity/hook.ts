import { useQuery } from '@tanstack/react-query';
import { getMyActivityFeed, ActivityItem } from './service';

export const useGetMyActivityFeed = (limit = 10) => {
  return useQuery<ActivityItem[]>({
    queryKey: ['activity-feed', limit],
    queryFn: () => getMyActivityFeed(limit),
    staleTime: 60_000,
    retry: 1,
  });
};


