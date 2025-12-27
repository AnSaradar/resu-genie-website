import apiClient from '@/lib/axios';
import { 
  PersonalProjectResponse, 
  PersonalProjectData, 
  PersonalProjectUpdateData, 
  PersonalProjectApiResponse, 
  PersonalProject 
} from './types';
import { handleServiceError } from '@/utils/error-utils';

/**
 * Convert PersonalProjectResponse from API to frontend PersonalProject structure
 * Maps backend snake_case (url, repository_url) to frontend camelCase (liveUrl, projectUrl)
 */
export const flattenPersonalProject = (project: PersonalProjectResponse): PersonalProject => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    technologies: project.technologies || [],
    startDate: project.start_date || '',
    endDate: project.end_date || '',
    isOngoing: project.is_ongoing,
    liveUrl: project.url || '', // Backend sends 'url', we map to 'liveUrl' for frontend
    projectUrl: project.repository_url || '', // Backend sends 'repository_url', we map to 'projectUrl' for frontend
    duration: project.duration,
  };
};

/**
 * Get all personal projects for the authenticated user
 * GET /api/v1/personal-project/
 */
export const getAllPersonalProjects = async (): Promise<PersonalProjectResponse[]> => {
  try {
    const response = await apiClient.get<PersonalProjectApiResponse>('/api/v1/personal-project/');
    return response.data.personal_projects || [];
  } catch (error: any) {
    throw handleServiceError(error, 'api.fetch_failed', 'project');
  }
};

/**
 * Add multiple personal projects
 * POST /api/v1/personal-project/
 */
export const addPersonalProjects = async (
  projects: PersonalProjectData[]
): Promise<PersonalProjectResponse[]> => {
  try {
    const response = await apiClient.post<PersonalProjectApiResponse>('/api/v1/personal-project/', projects);
    return response.data.personal_projects || [];
  } catch (error: any) {
    throw handleServiceError(error, 'api.create_failed', 'project');
  }
};

/**
 * Update a personal project
 * PUT /api/v1/personal-project/{project_id}
 */
export const updatePersonalProject = async (
  projectId: string,
  updateData: PersonalProjectUpdateData
): Promise<PersonalProjectResponse> => {
  try {
    const response = await apiClient.put<PersonalProjectApiResponse>(`/api/v1/personal-project/${projectId}`, updateData);
    return response.data.personal_project!;
  } catch (error: any) {
    throw handleServiceError(error, 'api.update_failed', 'project');
  }
};

/**
 * Delete a personal project
 * DELETE /api/v1/personal-project/{project_id}
 */
export const deletePersonalProject = async (projectId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/personal-project/${projectId}`);
  } catch (error: any) {
    throw handleServiceError(error, 'api.delete_failed', 'project');
  }
}; 