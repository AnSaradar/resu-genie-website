import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  getAllPersonalProjects, 
  addPersonalProjects, 
  updatePersonalProject, 
  deletePersonalProject, 
  flattenPersonalProject 
} from './service';
import { 
  PersonalProjectData, 
  PersonalProjectUpdateData, 
  PersonalProjectResponse, 
  PersonalProject 
} from './types';

/**
 * Hook to fetch all personal projects for the authenticated user
 */
export const useGetAllPersonalProjects = () => {
  return useQuery({
    queryKey: ['personalProjects'],
    queryFn: getAllPersonalProjects,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    select: (data: PersonalProjectResponse[]) => {
      return data.map(flattenPersonalProject);
    }
  });
};

/**
 * Hook to add multiple personal projects
 */
export const useAddPersonalProjects = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projects: PersonalProject[]) => {
      const apiData: PersonalProjectData[] = projects.map((p) => ({
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        start_date: p.startDate,
        end_date: p.endDate || undefined,
        is_ongoing: p.isOngoing,
        live_url: p.liveUrl || undefined,
        project_url: p.projectUrl || undefined,
      }));
      return addPersonalProjects(apiData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['personalProjects'] });
      toast.success(`Successfully added ${data.length} project${data.length > 1 ? 's' : ''}!`);
    },
    onError: (error: Error) => {
      console.error('Error adding personal projects:', error);
      toast.error(error.message || 'Failed to add personal projects');
    }
  });
};

/**
 * Hook to update a personal project
 */
export const useUpdatePersonalProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, updateData }: { projectId: string; updateData: PersonalProjectUpdateData }) => {
      return updatePersonalProject(projectId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalProjects'] });
      toast.success('Project updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Error updating personal project:', error);
      toast.error(error.message || 'Failed to update project');
    }
  });
};

/**
 * Hook to delete a personal project
 */
export const useDeletePersonalProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePersonalProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalProjects'] });
      toast.success('Project deleted successfully!');
    },
    onError: (error: Error) => {
      console.error('Error deleting personal project:', error);
      toast.error(error.message || 'Failed to delete project');
    }
  });
}; 