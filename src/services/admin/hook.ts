import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAdminUsers,
  searchAdminUsers,
  filterAdminUsers,
  getAdminUserById,
  getAdminUserCompleteData,
  updateAdminUserStatus,
  updateAdminUserRole,
  getAdminUserStats,
  getAdminUserTokenBalance,
  addAdminUserTokens,
  resetAdminUserTokens,
  createAdminUser,
} from './service';
import {
  AdminUser,
  AdminUserListResponse,
  AdminUserStats,
  AdminUserTokenBalance,
  AdminUserTokenTopUpRequest,
  AdminUserStatusUpdate,
  AdminUserRoleUpdate,
  AdminCreateRequest,
  AdminUserCompleteData,
} from './types';
import { toast } from 'react-hot-toast';

/**
 * Hook to get all users with pagination
 */
export const useAdminUsers = (
  page: number = 1,
  page_size: number = 20,
  sort_by: string = 'created_at',
  sort_order: number = -1,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['adminUsers', page, page_size, sort_by, sort_order],
    queryFn: () => getAdminUsers(page, page_size, sort_by, sort_order),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to search users
 */
export const useSearchAdminUsers = (
  query: string,
  page: number = 1,
  page_size: number = 20,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['adminUsersSearch', query, page, page_size],
    queryFn: () => searchAdminUsers(query, page, page_size),
    enabled: enabled && query.length > 0,
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to filter users
 */
export const useFilterAdminUsers = (
  role?: 'user' | 'admin',
  status?: 'active' | 'disabled',
  is_verified?: boolean,
  work_field?: string,
  page: number = 1,
  page_size: number = 20,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['adminUsersFilter', role, status, is_verified, work_field, page, page_size],
    queryFn: () => filterAdminUsers(role, status, is_verified, work_field, page, page_size),
    enabled,
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to get user by ID
 */
export const useAdminUserById = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['adminUser', userId],
    queryFn: () => getAdminUserById(userId),
    enabled: enabled && !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to get complete user data
 */
export const useAdminUserCompleteData = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['adminUserCompleteData', userId],
    queryFn: () => getAdminUserCompleteData(userId),
    enabled: enabled && !!userId,
    staleTime: 60 * 1000,
  });
};

/**
 * Hook to get user statistics
 */
export const useAdminUserStats = () => {
  return useQuery({
    queryKey: ['adminUserStats'],
    queryFn: getAdminUserStats,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to get user token balance
 */
export const useAdminUserTokenBalance = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['adminUserTokenBalance', userId],
    queryFn: () => getAdminUserTokenBalance(userId),
    enabled: enabled && !!userId,
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to update user status
 */
export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, statusUpdate }: { userId: string; statusUpdate: AdminUserStatusUpdate }) =>
      updateAdminUserStatus(userId, statusUpdate),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminUser', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['adminUserStats'] });
      toast.success(`User status updated to ${data.status}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user status');
    },
  });
};

/**
 * Hook to update user role
 */
export const useUpdateAdminUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleUpdate }: { userId: string; roleUpdate: AdminUserRoleUpdate }) =>
      updateAdminUserRole(userId, roleUpdate),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminUser', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['adminUserStats'] });
      toast.success(`User role updated to ${data.role}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user role');
    },
  });
};

/**
 * Hook to add tokens to user
 */
export const useAdminUserTokenTopUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, request }: { userId: string; request: AdminUserTokenTopUpRequest }) =>
      addAdminUserTokens(userId, request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminUserTokenBalance', variables.userId] });
      toast.success(`Successfully added ${variables.request.tokens_to_add} tokens`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add tokens');
    },
  });
};

/**
 * Hook to reset user tokens
 */
export const useAdminUserTokenReset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => resetAdminUserTokens(userId),
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: ['adminUserTokenBalance', userId] });
      toast.success('User tokens reset successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset tokens');
    },
  });
};

/**
 * Hook to create admin user
 */
export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AdminCreateRequest) => createAdminUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminUserStats'] });
      toast.success('Admin user created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create admin user');
    },
  });
};

