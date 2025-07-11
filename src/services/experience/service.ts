import apiClient from '@/lib/axios';
import { 
  ExperienceData, 
  ExperienceUpdateData, 
  ExperienceResponse, 
  ExperienceApiResponse,
  Experience,
  SeniorityLevel
} from './types';

/**
 * Convert ExperienceResponse (with location object) to flat Experience (with city/country)
 */
export const flattenExperience = (experience: ExperienceResponse): Experience => {
  return {
    id: experience.id,
    title: experience.title,
    seniority_level: experience.seniority_level,
    company: experience.company,
    city: experience.location?.city || '',
    country: experience.location?.country || '',
    start_date: experience.start_date,
    currently_working: experience.currently_working,
    end_date: experience.end_date || '',
    description: experience.description || '',
    is_volunteer: experience.is_volunteer,
    duration: experience.duration
  };
};

/**
 * Convert flat Experience to ExperienceData for API calls
 */
export const prepareExperienceData = (experience: Experience): ExperienceData => {
  return {
    title: experience.title,
    seniority_level: experience.seniority_level,
    company: experience.company,
    location: (experience.city || experience.country) ? {
      city: experience.city,
      country: experience.country
    } : undefined,
    start_date: experience.start_date,
    currently_working: experience.currently_working,
    end_date: experience.end_date || undefined,
    description: experience.description || undefined,
    is_volunteer: experience.is_volunteer
  };
};

/**
 * Add multiple experiences for the authenticated user
 * POST /api/v1/experience/add
 */
export const addExperiences = async (experiences: ExperienceData[]): Promise<ExperienceResponse[]> => {
  try {
    const response = await apiClient.post<ExperienceApiResponse>('/api/v1/experience/add', experiences);
    return response.data.experiences || [];
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to add experiences');
  }
};

/**
 * Update a specific experience entry
 * PUT /api/v1/experience/{experience_id}
 */
export const updateExperience = async (
  experienceId: string, 
  updateData: ExperienceUpdateData
): Promise<ExperienceResponse> => {
  try {
    const response = await apiClient.put<ExperienceApiResponse>(`/api/v1/experience/${experienceId}`, updateData);
    return response.data.experience!;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to update experience');
  }
};

/**
 * Delete a specific experience entry
 * DELETE /api/v1/experience/{experience_id}
 */
export const deleteExperience = async (experienceId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/experience/${experienceId}`);
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to delete experience');
  }
};

/**
 * Get all experiences for the authenticated user
 * GET /api/v1/experience/all
 */
export const getAllExperiences = async (): Promise<ExperienceResponse[]> => {
  try {
    const response = await apiClient.get<ExperienceApiResponse>('/api/v1/experience/all');
    return response.data.experiences || [];
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to get experiences');
  }
};

/**
 * Get seniority level options (static data)
 */
export const getSeniorityLevels = (): string[] => {
  return Object.values(SeniorityLevel);
}; 