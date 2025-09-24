import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  getAllLanguages, 
  addLanguages, 
  updateLanguage, 
  deleteLanguage, 
  flattenLanguage 
} from './service';
import { LanguageResponse, LanguageData, LanguageUpdateData, Language } from './types';

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

/**
 * Hook to add multiple languages
 */
export const useAddLanguages = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (languages: Language[]) => {
      const apiData: LanguageData[] = languages.map((lang) => ({
        name: lang.name,
        proficiency: lang.proficiency,
        is_native: lang.isNative,
      }));
      return addLanguages(apiData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      toast.success(`Successfully added ${data.length} language${data.length > 1 ? 's' : ''}!`);
    },
    onError: (error: Error) => {
      console.error('Error adding languages:', error);
      toast.error(error.message || 'Failed to add languages');
    },
  });
};

/**
 * Hook to update a single language
 */
export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ languageId, updateData }: { 
      languageId: string; 
      updateData: LanguageUpdateData 
    }) => {
      return updateLanguage(languageId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      toast.success('Language updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Error updating language:', error);
      toast.error(error.message || 'Failed to update language');
    },
  });
};

/**
 * Hook to delete a language
 */
export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      toast.success('Language deleted successfully!');
    },
    onError: (error: Error) => {
      console.error('Error deleting language:', error);
      toast.error(error.message || 'Failed to delete language');
    },
  });
}; 