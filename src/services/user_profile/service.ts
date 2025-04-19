import apiClient from '@/lib/axios'; // Import the configured client
import { UserProfileData, UserProfileResponse } from './types';
// getAuthToken and Authorization header are handled by the interceptor

export const createUserProfile = async (
  profileData: UserProfileData
): Promise<UserProfileResponse> => {

  try {
    // Adjust the field names if your API expects snake_case
    // The Authorization header will be added automatically by the interceptor
    const payload = {
        birth_date: profileData.birth_date,
        city: profileData.city,
        country: profileData.country,
        linkedin_profile: profileData.linkedin_profile,
        profile_summary: profileData.profile_summary,
        residency: profileData.residency,
        current_situation: profileData.current_situation,
        current_position: profileData.current_position,
        work_field: profileData.work_field,
    };

    const response = await apiClient.post<UserProfileResponse>( // Use apiClient
      `/user_profile/`, // Ensure trailing slash matches endpoint
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating user profile:", error);
    // The interceptor might handle 401, but other errors can still occur
    // Use apiClient.isAxiosError if needed (requires axios import)
    // Or rely on the interceptor's error handling / re-throwing
    // For now, re-throw a generic or potentially enhanced error from interceptor
    throw error; 
    /* 
    // Example more specific error checking if needed here:
    if (axios.isAxiosError(error) && error.response) { 
       // Check if it's *not* a 401 error already handled by interceptor
       if (error.response.status !== 401) { 
            throw new Error(error.response.data?.detail || 'Failed to create profile.');
       } else {
            // Error likely already handled by interceptor (e.g., refresh failed)
            throw error; // Re-throw the error potentially modified by the interceptor
       }
    }
    throw new Error('An unexpected error occurred while creating the profile.');
    */
  }
};
