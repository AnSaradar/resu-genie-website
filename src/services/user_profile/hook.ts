import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUserProfile, updateUserProfile, getUserProfile, getWorkFields, getCountries, checkProfileExists } from './service';
import { UserProfileData, UserProfileResponse } from './types';
import { toast } from 'react-hot-toast';

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUserProfile,
    onSuccess: (data) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile created successfully!');
    },
    onError: (error: Error) => {
      console.error('Error creating profile:', error);
      toast.error(error.message || 'Failed to create profile');
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetWorkFields = () => {
  return useQuery({
    queryKey: ['workFields'],
    queryFn: getWorkFields,
    staleTime: 30 * 60 * 1000, // 30 minutes - static data
    gcTime: 60 * 60 * 1000, // 1 hour (renamed from cacheTime in React Query v5)
  });
};

export const useGetCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
    staleTime: 30 * 60 * 1000, // 30 minutes - static data
    gcTime: 60 * 60 * 1000, // 1 hour (renamed from cacheTime in React Query v5)
  });
};

/**
 * Hook to check if the authenticated user has completed their profile
 */
export const useCheckProfileExists = () => {
  return useQuery({
    queryKey: ['checkProfileExists'],
    queryFn: checkProfileExists,
    retry: false, // Don't retry on auth errors
    refetchOnWindowFocus: false, // Don't refetch when window gets focus
  });
};
