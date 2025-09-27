import apiClient from '@/lib/axios';
import { ResumeCreateRequest, ResumeCreateResponse, ResumeExportParams, ResumeRenameRequest, ResumeRenameResponse } from './types';
import { ResumeListResponse } from './types';
import { ResumeDetailsResponse } from './types';

/**
 * Create a new resume record (from scratch) for the authenticated user.
 * Endpoint: POST /api/v1/resume/create-from-scratch
 */
export const createResume = async (payload: ResumeCreateRequest): Promise<ResumeCreateResponse> => {
  try {
    const response = await apiClient.post<ResumeCreateResponse>('/api/v1/resume/create-from-scratch', payload);
    return response.data;
  } catch (error: any) {
    // Forward backend error message if available
    const message = error.response?.data?.message || 'Failed to create resume';
    throw new Error(message);
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
    const message = error.response?.data?.message || 'Failed to export resume PDF';
    throw new Error(message);
  }
};

/**
 * Fetch list of resumes for current user.
 * Endpoint: GET /api/v1/resume/list
 */
export const fetchMyResumes = async (): Promise<ResumeListResponse> => {
  try {
    const response = await apiClient.get<ResumeListResponse>('/api/v1/resume/list');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch resumes';
    throw new Error(message);
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
    const message = error.response?.data?.message || 'Failed to fetch resume details';
    throw new Error(message);
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
    const message = error.response?.data?.message || 'Failed to update resume';
    throw new Error(message);
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
    const message = error.response?.data?.message || 'Failed to rename resume';
    throw new Error(message);
  }
}; 