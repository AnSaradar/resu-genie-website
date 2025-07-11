import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  addEducations, 
  updateEducation, 
  deleteEducation, 
  getAllEducations,
  getEducation,
  getDegreeTypes,
  flattenEducation,
  prepareEducationData
} from './service';
import { 
  EducationData, 
  EducationUpdateData, 
  Education,
  EducationResponse
} from './types';

/**
 * Hook to get all education entries for the authenticated user
 * Returns flattened education entries
 */
export const useGetAllEducations = () => {
  return useQuery({
    queryKey: ['educations'],
    queryFn: getAllEducations,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: EducationResponse[]) => {
      // Flatten education entries to match frontend interface
      return data.map(flattenEducation);
    }
  });
};

/**
 * Hook to get a specific education entry by ID
 */
export const useGetEducation = (educationId: string) => {
  return useQuery({
    queryKey: ['education', educationId],
    queryFn: () => getEducation(educationId),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: flattenEducation,
    enabled: !!educationId
  });
};

/**
 * Hook to add multiple education entries
 */
export const useAddEducations = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (educations: Education[]) => {
      // Convert flat educations to API format
      const apiData = educations.map(prepareEducationData);
      return addEducations(apiData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch educations
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      toast.success(`Successfully added ${data.length} education entr${data.length > 1 ? 'ies' : 'y'}!`);
    },
    onError: (error: Error) => {
      console.error('Error adding education entries:', error);
      toast.error(error.message || 'Failed to add education entries');
    },
  });
};

/**
 * Hook to update a single education entry
 */
export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ educationId, updateData }: { 
      educationId: string; 
      updateData: EducationUpdateData 
    }) => {
      return updateEducation(educationId, updateData);
    },
    onSuccess: () => {
      // Invalidate and refetch educations
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      toast.success('Education updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Error updating education:', error);
      toast.error(error.message || 'Failed to update education');
    },
  });
};

/**
 * Hook to delete an education entry
 */
export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      // Invalidate and refetch educations
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      toast.success('Education deleted successfully!');
    },
    onError: (error: Error) => {
      console.error('Error deleting education:', error);
      toast.error(error.message || 'Failed to delete education');
    },
  });
};

/**
 * Hook to get degree type options (static data)
 */
export const useGetDegreeTypes = () => {
  return useQuery({
    queryKey: ['degreeTypes'],
    queryFn: getDegreeTypes,
    staleTime: Infinity, // Static data never goes stale
    gcTime: Infinity, // Keep in cache forever
  });
}; 