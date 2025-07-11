import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  addExperiences, 
  updateExperience, 
  deleteExperience, 
  getAllExperiences,
  getSeniorityLevels,
  flattenExperience,
  prepareExperienceData
} from './service';
import { 
  ExperienceData, 
  ExperienceUpdateData, 
  Experience,
  ExperienceResponse
} from './types';

/**
 * Hook to get all experiences for the authenticated user
 * Returns flattened experiences (city/country instead of location object)
 */
export const useGetAllExperiences = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: getAllExperiences,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: ExperienceResponse[]) => {
      // Flatten location object to city/country fields
      return data.map(flattenExperience);
    }
  });
};

/**
 * Hook to add multiple experiences
 */
export const useAddExperiences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (experiences: Experience[]) => {
      // Convert flat experiences to API format
      const apiData = experiences.map(prepareExperienceData);
      return addExperiences(apiData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch experiences
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success(`Successfully added ${data.length} experience${data.length > 1 ? 's' : ''}!`);
    },
    onError: (error: Error) => {
      console.error('Error adding experiences:', error);
      toast.error(error.message || 'Failed to add experiences');
    },
  });
};

/**
 * Hook to update a single experience
 */
export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ experienceId, updateData }: { 
      experienceId: string; 
      updateData: ExperienceUpdateData 
    }) => {
      return updateExperience(experienceId, updateData);
    },
    onSuccess: () => {
      // Invalidate and refetch experiences
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Error updating experience:', error);
      toast.error(error.message || 'Failed to update experience');
    },
  });
};

/**
 * Hook to delete an experience
 */
export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      // Invalidate and refetch experiences
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience deleted successfully!');
    },
    onError: (error: Error) => {
      console.error('Error deleting experience:', error);
      toast.error(error.message || 'Failed to delete experience');
    },
  });
};

/**
 * Hook to get seniority level options (static data)
 */
export const useGetSeniorityLevels = () => {
  return useQuery({
    queryKey: ['seniorityLevels'],
    queryFn: getSeniorityLevels,
    staleTime: Infinity, // Static data never goes stale
    gcTime: Infinity, // Keep in cache forever
  });
}; 