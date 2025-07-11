import apiClient from '@/lib/axios';
import { 
  EducationData, 
  EducationUpdateData, 
  EducationResponse, 
  EducationApiResponse,
  Education,
  Degree
} from './types';

/**
 * Convert EducationResponse to frontend Education interface
 */
export const flattenEducation = (education: EducationResponse): Education => {
  return {
    id: education.id,
    institution: education.institution,
    degree: education.degree,
    field: education.field,
    start_date: education.start_date,
    currently_studying: education.currently_studying,
    end_date: education.end_date || '',
    description: education.description || '',
    duration: education.duration
  };
};

/**
 * Convert frontend Education to EducationData for API calls
 */
export const prepareEducationData = (education: Education): EducationData => {
  return {
    institution: education.institution,
    degree: education.degree,
    field: education.field,
    start_date: education.start_date,
    currently_studying: education.currently_studying,
    end_date: education.end_date || undefined,
    description: education.description || undefined
  };
};

/**
 * Add multiple education entries for the authenticated user
 * POST /api/v1/education/
 */
export const addEducations = async (educations: EducationData[]): Promise<EducationResponse[]> => {
  try {
    const response = await apiClient.post<EducationApiResponse>('/api/v1/education/', educations);
    return response.data.educations || [];
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to add education entries');
  }
};

/**
 * Update a specific education entry
 * PUT /api/v1/education/{education_id}
 */
export const updateEducation = async (
  educationId: string, 
  updateData: EducationUpdateData
): Promise<EducationResponse> => {
  try {
    const response = await apiClient.put<EducationApiResponse>(`/api/v1/education/${educationId}`, updateData);
    return response.data.education!;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to update education');
  }
};

/**
 * Delete a specific education entry
 * DELETE /api/v1/education/{education_id}
 */
export const deleteEducation = async (educationId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/education/${educationId}`);
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to delete education');
  }
};

/**
 * Get all education entries for the authenticated user
 * GET /api/v1/education/
 */
export const getAllEducations = async (): Promise<EducationResponse[]> => {
  try {
    const response = await apiClient.get<EducationApiResponse>('/api/v1/education/');
    return response.data.educations || [];
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to get education entries');
  }
};

/**
 * Get a specific education entry by ID
 * GET /api/v1/education/{education_id}
 */
export const getEducation = async (educationId: string): Promise<EducationResponse> => {
  try {
    const response = await apiClient.get<EducationApiResponse>(`/api/v1/education/${educationId}`);
    return response.data.education!;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to get education');
  }
};

/**
 * Get degree type options (static data)
 */
export const getDegreeTypes = (): string[] => {
  return Object.values(Degree);
}; 