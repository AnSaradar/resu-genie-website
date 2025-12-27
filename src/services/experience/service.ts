import apiClient from '@/lib/axios';
import { 
  ExperienceData, 
  ExperienceUpdateData, 
  ExperienceResponse, 
  ExperienceApiResponse,
  Experience,
  SeniorityLevel,
  WorkType,
  WorkModel
} from './types';
import { handleServiceError, extractApiErrorMessage } from '@/utils/error-utils';
import { normalizeMonthValue } from '@/utils/date';

/**
 * Convert ExperienceResponse (with location object) to flat Experience (with city/country)
 * Normalizes dates from YYYY-MM-DD to YYYY-MM for month input compatibility
 */
export const flattenExperience = (experience: ExperienceResponse): Experience => {
  return {
    id: experience.id,
    title: experience.title,
    seniority_level: experience.seniority_level,
    company: experience.company,
    city: experience.location?.city || '',
    country: experience.location?.country || '',
    start_date: normalizeMonthValue(experience.start_date),
    currently_working: experience.currently_working,
    end_date: normalizeMonthValue(experience.end_date || ''),
    description: experience.description || '',
    is_volunteer: experience.is_volunteer,
    work_type: experience.work_type,
    work_model: experience.work_model,
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
    is_volunteer: experience.is_volunteer,
    work_type: experience.work_type,
    work_model: experience.work_model
  };
};

/**
 * Add multiple experiences for the authenticated user
 * POST /api/v1/experience/
 */
export const addExperiences = async (experiences: ExperienceData[]): Promise<ExperienceResponse[]> => {
  try {
    const response = await apiClient.post<ExperienceApiResponse>('/api/v1/experience/', experiences);
    return response.data.experiences || [];
  } catch (error: any) {
    throw handleServiceError(error, 'api.create_failed', 'experience');
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
    throw handleServiceError(error, 'api.update_failed', 'experience');
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
    throw handleServiceError(error, 'api.delete_failed', 'experience');
  }
};

/**
 * Get all experiences for the authenticated user
 * GET /api/v1/experience/
 */
export const getAllExperiences = async (): Promise<ExperienceResponse[]> => {
  try {
    const response = await apiClient.get<ExperienceApiResponse>('/api/v1/experience/');
    return response.data.experiences || [];
  } catch (error: any) {
    throw handleServiceError(error, 'api.fetch_failed', 'experience');
  }
};

/**
 * Get a single experience by id
 * GET /api/v1/experience/{experience_id}/
 */
export const getExperience = async (experienceId: string): Promise<ExperienceResponse> => {
  try {
    const response = await apiClient.get<ExperienceApiResponse>(`/api/v1/experience/${experienceId}`);
    return response.data.experience!;
  } catch (error: any) {
    const message = extractApiErrorMessage(error, 'api.fetch_failed', 'experience');
    throw new Error(message);
  }
};

/**
 * Get seniority level options (static data)
 */
export const getSeniorityLevels = (): string[] => {
  return Object.values(SeniorityLevel);
};

/**
 * Get work type options (static data)
 */
export const getWorkTypes = (): string[] => {
  return Object.values(WorkType);
};

/**
 * Get work model options (static data)
 */
export const getWorkModels = (): string[] => {
  return Object.values(WorkModel);
}; 