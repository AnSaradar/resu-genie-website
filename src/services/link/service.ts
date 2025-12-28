import apiClient from '@/lib/axios';
import {
  LinkData,
  LinkUpdateData,
  LinkResponse,
  LinkApiResponse,
  Link,
} from './types';
import { handleServiceError } from '@/utils/error-utils';

/**
 * Convert LinkResponse to frontend Link interface
 * Maps snake_case backend fields to camelCase frontend fields
 */
export const flattenLink = (link: LinkResponse): Link => {
  return {
    id: link.id,
    websiteName: link.website_name,
    websiteUrl: link.website_url,
  };
};

/**
 * Convert frontend Link to LinkData for API calls
 */
export const prepareLinkData = (link: Link): LinkData => {
  return {
    website_name: link.websiteName,
    website_url: link.websiteUrl,
  };
};

/** POST /api/v1/link/ */
export const addLinks = async (links: LinkData[]): Promise<LinkResponse[]> => {
  try {
    const response = await apiClient.post<LinkApiResponse>('/api/v1/link/', links);
    return response.data.links || [];
  } catch (error: any) {
    throw handleServiceError(error, 'api.create_failed', 'link');
  }
};

/** PUT /api/v1/link/{link_id} */
export const updateLink = async (
  linkId: string,
  updateData: LinkUpdateData
): Promise<LinkResponse> => {
  try {
    const response = await apiClient.put<LinkApiResponse>(`/api/v1/link/${linkId}`, updateData);
    return response.data.link!;
  } catch (error: any) {
    throw handleServiceError(error, 'api.update_failed', 'link');
  }
};

/** DELETE /api/v1/link/{link_id} */
export const deleteLink = async (linkId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/link/${linkId}`);
  } catch (error: any) {
    throw handleServiceError(error, 'api.delete_failed', 'link');
  }
};

/** GET /api/v1/link/ */
export const getAllLinks = async (): Promise<LinkResponse[]> => {
  try {
    const response = await apiClient.get<LinkApiResponse>('/api/v1/link/');
    return response.data.links || [];
  } catch (error: any) {
    throw handleServiceError(error, 'api.fetch_failed', 'link');
  }
};

