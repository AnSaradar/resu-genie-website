import apiClient from '@/lib/axios';
import { ResumeCreateRequest, ResumeCreateResponse, ResumeExportParams, ResumeRenameRequest, ResumeRenameResponse } from './types';
import { ResumeListResponse } from './types';
import { ResumeDetailsResponse } from './types';
import { handleServiceError } from '@/utils/error-utils';

/**
 * Create a new resume record (from scratch) for the authenticated user.
 * Endpoint: POST /api/v1/resume/create-from-scratch
 */
export const createResume = async (payload: ResumeCreateRequest): Promise<ResumeCreateResponse> => {
  try {
    const response = await apiClient.post<ResumeCreateResponse>('/api/v1/resume/create-from-scratch', payload);
    return response.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.create_failed', 'resume');
  }
};

/**
 * Export existing resume as PDF. The backend returns the PDF file (blob).
 * Endpoint: GET /api/v1/resume/export/{resume_id}/template/{template_name}
 */
export const exportResumePdf = async ({ resumeId, templateName }: ResumeExportParams): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/api/v1/resume/export/${resumeId}/template/${templateName}`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  } catch (error: any) {
    throw handleServiceError(error, 'api.operation_failed', 'resume');
  }
};

/**
 * Export resume PDF directly from account data with template selection.
 * The backend returns the PDF file (blob).
 * Endpoint: POST /api/v1/resume/export-from-account?template={templateName}
 * 
 * Maps frontend template IDs (lowercase) to backend template filenames.
 * Uses the same mapping as ResumeGenerator.tsx for consistency.
 */
export const exportResumeFromAccount = async (templateId: string): Promise<Blob> => {
  try {
    // Map frontend template IDs to backend template filenames (same as ResumeGenerator.tsx)
    const templateMap: Record<string, string> = {
      'moey': 'moey_template.html',
      'simple': 'simple_template.html',
      'jobscan': 'jobscan_template.html',
      'new': 'new_template.html',
    };
    
    // Get the template filename, defaulting to moey if not found
    const templateName = templateMap[templateId.toLowerCase()] || 'moey_template.html';
    
    const response = await apiClient.post(
      `/api/v1/resume/export-from-account?template=${templateName}`,
      {},
      {
        responseType: 'blob',
      }
    );
    return response.data as Blob;
  } catch (error: any) {
    // When responseType is 'blob', axios treats JSON error responses as Blobs
    // We need to parse the blob as JSON to extract error details
    if (error.response?.data instanceof Blob && error.response?.status === 422) {
      try {
        const text = await error.response.data.text();
        const errorData = JSON.parse(text);
        // Replace the blob with parsed JSON so error utilities can process it
        error.response.data = errorData;
      } catch (parseError) {
        // If parsing fails, fall through to default error handling
        console.error('Failed to parse blob error response as JSON:', parseError);
      }
    }
    
    // Use handleServiceError for consistent error handling
    throw handleServiceError(error, 'api.operation_failed', 'resume');
  }
};

/**
 * Fetch list of resumes for current user.
 * Endpoint: GET /api/v1/resume/list
 * @param limit Optional limit to restrict number of results (sorted by updated_at descending)
 */
export const fetchMyResumes = async (limit?: number): Promise<ResumeListResponse> => {
  try {
    const params = limit ? { limit } : {};
    const response = await apiClient.get<ResumeListResponse>('/api/v1/resume/list', { params });
    return response.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.fetch_failed', 'resume');
  }
};

/**
 * Fetch details of a single resume by ID.
 * Endpoint: GET /api/v1/resume/{resume_id}
 */
export const getResumeDetails = async (resumeId: string): Promise<ResumeDetailsResponse> => {
  try {
    const response = await apiClient.get<ResumeDetailsResponse>(`/api/v1/resume/${resumeId}`);
    return response.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.fetch_failed', 'resume');
  }
};

/**
 * Update an existing resume by ID.
 * Endpoint: PUT /api/v1/resume/{resume_id}
 */
export const updateResume = async (resumeId: string, payload: any): Promise<any> => {
  try {
    const response = await apiClient.put(`/api/v1/resume/${resumeId}`, payload);
    return response.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.update_failed', 'resume');
  }
};

/**
 * Rename an existing resume by ID.
 * Endpoint: PATCH /api/v1/resume/{resume_id}/rename
 */
export const renameResume = async (resumeId: string, payload: ResumeRenameRequest): Promise<ResumeRenameResponse> => {
  try {
    const response = await apiClient.patch<ResumeRenameResponse>(`/api/v1/resume/${resumeId}/rename`, payload);
    return response.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.update_failed', 'resume');
  }
}; 