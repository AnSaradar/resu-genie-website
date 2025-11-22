import apiClient from '@/lib/axios';
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
  ApiResponse,
} from './types';

const ADMIN_BASE_URL = '/api/v1/admin';

/**
 * Get all users with pagination
 */
export const getAdminUsers = async (
  page: number = 1,
  page_size: number = 20,
  sort_by: string = 'created_at',
  sort_order: number = -1
): Promise<AdminUserListResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<AdminUserListResponse>>(
      `${ADMIN_BASE_URL}/users`,
      {
        params: { page, page_size, sort_by, sort_order },
      }
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to fetch users';
    throw new Error(message);
  }
};

/**
 * Search users by email or name
 */
export const searchAdminUsers = async (
  query: string,
  page: number = 1,
  page_size: number = 20
): Promise<AdminUserListResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<AdminUserListResponse>>(
      `${ADMIN_BASE_URL}/users/search`,
      {
        params: { query, page, page_size },
      }
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to search users';
    throw new Error(message);
  }
};

/**
 * Filter users by role, status, verification, and work field
 */
export const filterAdminUsers = async (
  role?: 'user' | 'admin',
  status?: 'active' | 'disabled',
  is_verified?: boolean,
  work_field?: string,
  page: number = 1,
  page_size: number = 20
): Promise<AdminUserListResponse> => {
  try {
    const params: any = { page, page_size };
    if (role) params.role = role;
    if (status) params.user_status = status;
    if (is_verified !== undefined) params.is_verified = is_verified;
    if (work_field) params.work_field = work_field;

    const response = await apiClient.get<ApiResponse<AdminUserListResponse>>(
      `${ADMIN_BASE_URL}/users/filter`,
      { params }
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to filter users';
    throw new Error(message);
  }
};

/**
 * Get user by ID
 */
export const getAdminUserById = async (userId: string): Promise<AdminUser> => {
  try {
    const response = await apiClient.get<ApiResponse<AdminUser>>(
      `${ADMIN_BASE_URL}/users/${userId}`
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to fetch user';
    throw new Error(message);
  }
};

/**
 * Get complete user data (all user information in one request)
 */
export const getAdminUserCompleteData = async (
  userId: string
): Promise<AdminUserCompleteData> => {
  try {
    const response = await apiClient.get<ApiResponse<AdminUserCompleteData>>(
      `${ADMIN_BASE_URL}/users/${userId}/complete-data`
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to fetch user data';
    throw new Error(message);
  }
};

/**
 * Update user status
 */
export const updateAdminUserStatus = async (
  userId: string,
  statusUpdate: AdminUserStatusUpdate
): Promise<AdminUser> => {
  try {
    const response = await apiClient.patch<ApiResponse<AdminUser>>(
      `${ADMIN_BASE_URL}/users/${userId}/status`,
      statusUpdate
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to update user status';
    throw new Error(message);
  }
};

/**
 * Update user role
 */
export const updateAdminUserRole = async (
  userId: string,
  roleUpdate: AdminUserRoleUpdate
): Promise<AdminUser> => {
  try {
    const response = await apiClient.patch<ApiResponse<AdminUser>>(
      `${ADMIN_BASE_URL}/users/${userId}/role`,
      roleUpdate
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to update user role';
    throw new Error(message);
  }
};

/**
 * Get user statistics
 */
export const getAdminUserStats = async (): Promise<AdminUserStats> => {
  try {
    const response = await apiClient.get<ApiResponse<AdminUserStats>>(
      `${ADMIN_BASE_URL}/stats`
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to fetch statistics';
    throw new Error(message);
  }
};

/**
 * Get user token balance
 */
export const getAdminUserTokenBalance = async (
  userId: string
): Promise<AdminUserTokenBalance> => {
  try {
    const response = await apiClient.get<ApiResponse<AdminUserTokenBalance>>(
      `${ADMIN_BASE_URL}/users/${userId}/tokens`
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to fetch token balance';
    throw new Error(message);
  }
};

/**
 * Add tokens to user account
 */
export const addAdminUserTokens = async (
  userId: string,
  request: AdminUserTokenTopUpRequest
): Promise<AdminUserTokenBalance> => {
  try {
    const response = await apiClient.post<ApiResponse<AdminUserTokenBalance>>(
      `${ADMIN_BASE_URL}/users/${userId}/tokens/add`,
      request
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to add tokens';
    throw new Error(message);
  }
};

/**
 * Reset user tokens
 */
export const resetAdminUserTokens = async (
  userId: string
): Promise<AdminUserTokenBalance> => {
  try {
    const response = await apiClient.post<ApiResponse<AdminUserTokenBalance>>(
      `${ADMIN_BASE_URL}/users/${userId}/tokens/reset`
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to reset tokens';
    throw new Error(message);
  }
};

/**
 * Create admin user
 */
export const createAdminUser = async (
  request: AdminCreateRequest
): Promise<AdminUser> => {
  try {
    const response = await apiClient.post<ApiResponse<AdminUser>>(
      `${ADMIN_BASE_URL}/users/create-admin`,
      request
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 'Failed to create admin user';
    throw new Error(message);
  }
};

