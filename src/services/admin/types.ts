// Admin Service Types - Mirroring backend DTOs from src/dto/admin.py and src/dto/token.py

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string; // 'user' or 'admin'
  status: string; // 'active' or 'disabled'
  is_verified: boolean;
  created_at: string;
  last_login_at?: string | null;
  last_activity_at?: string | null;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AdminUserStats {
  total_users: number;
  verified_users: number;
  unverified_users: number;
  active_users: number;
  disabled_users: number;
  admin_users: number;
  regular_users: number;
}

export interface AdminUserTokenBalance {
  tokens_remaining: number;
  total_tokens_used: number;
  tokens_last_updated_at?: string | null;
}

export interface AdminUserTokenTopUpRequest {
  tokens_to_add: number;
}

export interface AdminUserStatusUpdate {
  status: 'active' | 'disabled';
}

export interface AdminUserRoleUpdate {
  role: 'user' | 'admin';
}

export interface AdminCreateRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// Complete user data response (from /users/{user_id}/complete-data)
export interface AdminUserCompleteData {
  user: AdminUser;
  profile?: any;
  education?: any[];
  experiences?: any[];
  certifications?: any[];
  skills?: any[];
  languages?: any[];
  links?: any[];
  projects?: any[];
  custom_sections?: any[];
}

// API Response wrapper
export interface ApiResponse<T> {
  signal: string;
  data: T;
}

