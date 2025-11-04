import apiClient from '@/lib/axios'; // Import the configured client
import { UserProfileData, UserProfileResponse, ProfileExistsResponse, WorkField, ApiResponse, WorkFieldsResponse, CountriesResponse } from './types';
// getAuthToken and Authorization header are handled by the interceptor

/**
 * Check if the authenticated user has completed their profile information
 */
export const checkProfileExists = async (): Promise<ProfileExistsResponse> => {
  try {
    const response = await apiClient.get('/api/v1/user_profile/check-profile-exists');
    return response.data;
  } catch (error: any) {
    // Handle 404 as expected response (profile doesn't exist)
    if (error.response?.status === 404 && error.response?.data) {
      // Backend returns profile_exists: false in the response body even for 404
      return error.response.data;
    }
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

export const updateUserProfile = async (
  profileData: UserProfileData
): Promise<UserProfileResponse> => {
  try {
    const response = await apiClient.post('/api/v1/user_profile', profileData);
    return response.data.profile_data; // Same endpoint for create/update
  } catch (error: any) {
    // Handle error response
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to update user profile');
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
    const response = await apiClient.get<ApiResponse<WorkFieldsResponse>>('/api/v1/user_profile/work-fields');
    // Extract the work_fields array from the response data structure
    return response.data.data.work_fields;
  } catch (error: any) {
    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      throw new Error(error.response.data.errors[0]);
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to get work fields');
  }
};

export const getCountries = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<ApiResponse<CountriesResponse>>('/api/v1/user_profile/countries');
    // Extract the countries array from the response data structure
    return response.data.data.countries;
  } catch (error: any) {
    if (error.response?.data?.errors && error.response.data.errors.length > 0) {
      throw new Error(error.response.data.errors[0]);
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to get countries');
  }
};
