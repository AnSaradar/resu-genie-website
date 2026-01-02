import apiClient from '@/lib/axios';
import { UserUpdateData, UserUpdateResponse } from './types';
import { handleServiceError } from '@/utils/error-utils';

/**
 * Update the current authenticated user's information
 * @param userData - User data to update (first_name, last_name, phone, preferred_language)
 * @returns Updated user information
 */
export const updateUser = async (
  userData: UserUpdateData
): Promise<UserUpdateResponse> => {
  try {
    const response = await apiClient.put<UserUpdateResponse>('/api/v1/auth/me', userData);
    return response.data;
  } catch (error: any) {
    throw handleServiceError(error, 'api.update_failed', 'user');
  }
};

