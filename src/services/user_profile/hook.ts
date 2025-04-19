import { useMutation } from '@tanstack/react-query';
import { createUserProfile } from './service';
import { UserProfileData, UserProfileResponse } from './types';

export const useCreateUserProfile = () => {
  return useMutation<
    UserProfileResponse, // Type of data returned on success
    Error, // Type of error thrown on failure
    UserProfileData // Type of variables passed to the mutation function
  >({
    mutationFn: createUserProfile, // The function that performs the mutation
    // Optional: onSuccess, onError, onSettled callbacks
    onSuccess: (data) => {
      console.log('Profile created successfully:', data);
      // You might want to invalidate queries related to user profile here
      // queryClient.invalidateQueries(['userProfile']);
    },
    onError: (error) => {
      console.error('Profile creation failed:', error.message);
      // Display error messages to the user, e.g., using a toast notification
    },
  });
};
