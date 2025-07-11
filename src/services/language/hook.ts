import { useQuery } from '@tanstack/react-query';
import { getAllLanguages, flattenLanguage } from './service';
import { LanguageResponse } from './types';

/**
 * Hook to fetch all languages belonging to the authenticated user.
 * Returns flattened language objects ready for UI consumption.
 */
export const useGetAllLanguages = () => {
  return useQuery({
    queryKey: ['languages'],
    queryFn: getAllLanguages,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: LanguageResponse[]) => data.map(flattenLanguage),
  });
}; 