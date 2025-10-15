import apiClient from '@/lib/axios';

export type SortOrder = 1 | -1;

export interface GetUsersParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: SortOrder;
}

export interface SearchUsersParams {
  query: string;
  page?: number;
  page_size?: number;
}

export interface FilterUsersParams {
  role?: 'user' | 'admin';
  status?: 'active' | 'disabled';
  is_verified?: boolean;
  work_field?: string | null;
  page?: number;
  page_size?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  role: 'user' | 'admin';
  status: 'active' | 'disabled';
  is_verified: boolean;
  created_at: string;
  last_login_at?: string | null;
  last_activity_at?: string | null;
}

export interface UserListResponse {
  users: AdminUser[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface StatsResponse {
  total_users: number;
  verified_users: number;
  unverified_users: number;
  active_users: number;
  disabled_users: number;
  admin_users: number;
  regular_users: number;
}

export const AdminService = {
  async getStats(): Promise<StatsResponse> {
    const { data } = await apiClient.get('/api/v1/admin/stats');
    return data.data as StatsResponse;
  },

  async getUsers(params: GetUsersParams = {}): Promise<UserListResponse> {
    const { page = 1, page_size = 20, sort_by = 'created_at', sort_order = -1 } = params;
    const { data } = await apiClient.get('/api/v1/admin/users', {
      params: { page, page_size, sort_by, sort_order }
    });
    return data.data as UserListResponse;
  },

  async searchUsers(params: SearchUsersParams): Promise<UserListResponse> {
    const { query, page = 1, page_size = 20 } = params;
    const { data } = await apiClient.get('/api/v1/admin/users/search', {
      params: { query, page, page_size }
    });
    return data.data as UserListResponse;
  },

  async filterUsers(params: FilterUsersParams): Promise<UserListResponse> {
    const { role, status, is_verified, work_field, page = 1, page_size = 20 } = params;
    const { data } = await apiClient.get('/api/v1/admin/users/filter', {
      params: { role, user_status: status, is_verified, work_field, page, page_size }
    });
    return data.data as UserListResponse;
  },

  async getCompleteData(userId: string): Promise<any> {
    const { data } = await apiClient.get(`/api/v1/admin/users/${userId}/complete-data`);
    return data.data;
  }
};


