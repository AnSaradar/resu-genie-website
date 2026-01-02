import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from './service';
import { UserUpdateData, UserUpdateResponse } from './types';
import { toast } from 'react-hot-toast';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: UserUpdateData) => updateUser(userData),
    onSuccess: (data: UserUpdateResponse) => {
      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('User information updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user information');
    },
  });
};

