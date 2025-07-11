import apiClient from '@/lib/axios'; // Import the configured client
import { UserProfileData, UserProfileResponse, ProfileExistsResponse, WorkField } from './types';
// getAuthToken and Authorization header are handled by the interceptor

/**
 * Check if the authenticated user has completed their profile information
 */
export const checkProfileExists = async (): Promise<ProfileExistsResponse> => {
  try {
    const response = await apiClient.get('/api/v1/user_profile/check-profile-exists');
    return response.data;
  } catch (error) {
    console.error('Error checking profile existence:', error);
    throw error;
  }
};

export const createUserProfile = async (
  profileData: UserProfileData
): Promise<UserProfileResponse> => {
  try {
    const response = await apiClient.post('/api/v1/user_profile', profileData);
    return response.data.profile_data; // Based on the backend JSONResponse structure
  } catch (error: any) {
    // Handle error response
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to create user profile');
  }
};

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await apiClient.get('/api/v1/user_profile');
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to get user profile');
  }
};

export const getWorkFields = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/api/v1/user_profile/work-fields');
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to get work fields');
  }
};
