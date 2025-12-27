import apiClient from '@/lib/axios';
import {
  Language,
  LanguageResponse,
  LanguageApiResponse,
  LanguageData,
  LanguageUpdateData,
} from './types';
import { handleServiceError } from '@/utils/error-utils';

/**
 * Convert backend LanguageResponse (snake_case) to frontend Language interface (camelCase)
 */
export const flattenLanguage = (lang: LanguageResponse): Language => {
  return {
    id: lang.id,
    name: lang.name,
    proficiency: lang.proficiency,
    isNative: lang.is_native,
  };
};

/**
 * Get all language entries for the authenticated user
 * GET /api/v1/language/
 */
export const getAllLanguages = async (): Promise<LanguageResponse[]> => {
  try {
    const response = await apiClient.get<LanguageApiResponse>('/api/v1/language/');
    return response.data.languages || [];
  } catch (error: any) {
    throw handleServiceError(error, 'api.fetch_failed', 'language');
  }
};

/**
 * Add multiple languages – not used yet in Resume Generator but provided for completeness
 * POST /api/v1/language/
 */
export const addLanguages = async (
  languages: LanguageData[]
): Promise<LanguageResponse[]> => {
  try {
    const response = await apiClient.post<LanguageApiResponse>('/api/v1/language/', languages);
    return response.data.languages || [];
  } catch (error: any) {
    throw handleServiceError(error, 'api.create_failed', 'language');
  }
};

/**
 * Update a specific language entry
 * PUT /api/v1/language/{language_id}
 */
export const updateLanguage = async (
  languageId: string,
  updateData: LanguageUpdateData
): Promise<LanguageResponse> => {
  try {
    const response = await apiClient.put<LanguageApiResponse>(`/api/v1/language/${languageId}`, updateData);
    return response.data.language as LanguageResponse;
  } catch (error: any) {
    throw handleServiceError(error, 'api.update_failed', 'language');
  }
};

/**
 * Delete a language entry
 * DELETE /api/v1/language/{language_id}
 */
export const deleteLanguage = async (languageId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/language/${languageId}`);
  } catch (error: any) {
    throw handleServiceError(error, 'api.delete_failed', 'language');
  }
}; 