// User update data structure matching backend UserUpdate DTO
export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  preferred_language?: string;
}

// User update response structure from backend
export interface UserUpdateResponse {
  status: string;
  message: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    is_verified?: boolean;
    role?: string;
    status?: string;
    created_at?: string;
    last_login_at?: string | null;
    last_activity_at?: string | null;
  };
}

