// Authentication Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

// Authentication Response Types
export interface AuthResponse {
  access_token: string;
  refresh_token?: string; // Made optional since backend doesn't return it yet
  user?: User; // Made optional since backend doesn't return it in login
  token_type?: string; // Added token_type from backend
  status?: string; // Added status from backend  
  // Registration-specific fields
  requires_verification?: boolean;
  is_verified?: boolean;
  email?: string;
  first_name?: string;
  last_name?: string;
  message?: string;
}

export interface User {
  id: string; // Changed from number to string (MongoDB ObjectId)
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_verified?: boolean; // Added verification status
  created_at?: string; // Made optional since backend might not always include it
  updated_at?: string; // Made optional since backend might not always include it
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}
