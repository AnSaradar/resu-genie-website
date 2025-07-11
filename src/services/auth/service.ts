import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
// Only import types used by AuthService
import { LoginRequest, RegisterRequest, AuthResponse, User } from './types'; 
import { 
    saveAuthToken, 
    getAuthToken, 
    removeAuthToken, 
    saveRefreshToken, 
    getRefreshToken, 
    removeRefreshToken 
} from './utils'; 

// Extend AxiosRequestConfig to include retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as ExtendedAxiosRequestConfig;
    
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          // Try to refresh token (if backend supports it)
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken
          });
          
          const { access_token } = response.data;
          saveAuthToken(access_token);
          
          // Retry the original request
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${access_token}`;
          
          return api(original);
        } else {
          // No refresh token available, logout user
          AuthService.logout();
          throw new Error('Session expired. Please login again.');
        }
      } catch (refreshError) {
        // Refresh failed or not supported, logout user
        console.log('Token refresh failed or not supported, logging out user');
        AuthService.logout();
        throw new Error('Session expired. Please login again.');
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Parse error response from API
 */
const parseErrorResponse = async (response: Response) => {
  try {
    const data = await response.json();
    
    // If the API returns a structured error
    if (data.error || data.message || data.errors) {
      return data;
    }
    
    // Generic error with status text
    return { message: response.statusText || 'Request failed' };
  } catch (err) {
    // If JSON parsing fails
    return { message: response.statusText || 'Request failed' };
  }
};

// Helper to create consistent error messages
const createApiError = (error: unknown, defaultMessage: string): Error => {
    if (axios.isAxiosError(error) && error.response) {
        const detail = error.response.data?.detail;
        const errors = error.response.data?.errors; 
        let message = defaultMessage;
        if (detail && typeof detail === 'string') {
            message = detail;
        } else if (errors && typeof errors === 'object') {
            message = Object.values(errors).flat().join(' ');
        }
        return new Error(message);
    }
    return new Error('An unexpected error occurred.');
};

/**
 * Authentication service for handling login, register, and token management using Axios
 */
export const AuthService = {
  /**
   * Login user with email and password
   * @param data - Login credentials { email, password }
   * @returns Authentication response 
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/v1/auth/login', data);
      const authData: AuthResponse = response.data;
      
      // Save access token (backend only returns access_token, not refresh_token)
      saveAuthToken(authData.access_token);
      
      // Only save refresh token if it exists
      if (authData.refresh_token) {
        saveRefreshToken(authData.refresh_token);
      }
      
      return authData;
    } catch (error) {
      if (error instanceof AxiosError) {
        // Extract error message from response
        const message = error.response?.data?.message || error.response?.data?.detail || 'Login failed';
        throw new Error(message);
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  /**
   * Register a new user
   * @param data - Registration data
   * @returns Authentication response
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/v1/auth/register', data);
      const authData: AuthResponse = response.data;
      
      return authData;
    } catch (error) {
      if (error instanceof AxiosError) {
        // Extract error message from response
        const message = error.response?.data?.message || error.response?.data?.detail || 'Registration failed';
        throw new Error(message);
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  /**
   * Logout user by removing tokens
   */
  logout(): void {
    removeAuthToken();
    removeRefreshToken();
    console.log("User logged out, tokens removed.");
  },

  /**
   * Check if user is authenticated based on access token presence
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    const token = getAuthToken();
    return token !== null;
  },

  /**
   * Get the current access token using the utility function
   * @returns Access token string or null
   */
  getAccessToken(): string | null {
    return getAuthToken();
  },

  /**
   * Get the current refresh token using the utility function
   * @returns Refresh token string or null
   */
  getRefreshToken(): string | null {
    return getRefreshToken();
  },

  /**
    * Refresh the access token using the refresh token.
    * @returns The new access token or null if refresh fails.
    */
   async refreshToken(): Promise<string | null> {
       const currentRefreshToken = getRefreshToken();
       if (!currentRefreshToken) {
           console.log("No refresh token available.");
           return null;
       }

       try {
           console.log("Attempting to refresh token...");
           // Use axios directly here as the instance interceptor might cause loops
           const response = await axios.post<{ access_token: string }>( 
               `${API_BASE_URL}/api/v1/auth/refresh`, 
               { refresh_token: currentRefreshToken }
           );
           const newAccessToken = response.data.access_token; 
           if (newAccessToken) {
               saveAuthToken(newAccessToken);
               console.log("Token refreshed successfully.");
               return newAccessToken;
           }
           throw new Error("No access token received in refresh response.");
       } catch (error) {
           console.error("Token refresh failed (backend may not support refresh tokens yet):", error);
           // Don't automatically logout here since the method might be called speculatively
           return null;
       }
   },

   /**
    * Get the current user information
    * @returns User information
    */
   async getCurrentUser(): Promise<User> {
       try {
           const response = await api.get('/api/v1/auth/me');
           
           // Backend returns { status, message, user }, so extract the user object
           if (response.data && response.data.user) {
               return response.data.user;
           }
           
           // Fallback in case the response structure is different
           return response.data;
       } catch (error) {
           if (error instanceof AxiosError) {
               const message = error.response?.data?.message || error.response?.data?.detail || 'Failed to get user data';
               throw new Error(message);
           }
           throw new Error('Failed to get user data');
       }
   },

   /**
    * Validate the current access token
    * @returns Boolean indicating token validity
    */
   async validateToken(): Promise<boolean> {
       try {
           const token = getAuthToken();
           if (!token) {
               return false;
           }

           // Try to get current user to validate token
           await this.getCurrentUser();
           return true;
       } catch (error) {
           // Token is invalid, remove it
           this.logout();
           return false;
       }
   },

   /**
    * Send OTP to email address
    */
   async sendOTP(email: string, purpose: string = 'verification'): Promise<any> {
     try {
       const response = await api.post('/api/v1/otp/send', {
         email,
         purpose
       });
       return response.data;
     } catch (error) {
       throw createApiError(error, 'Failed to send OTP');
     }
   },

   /**
    * Verify OTP code
    */
   async verifyOTP(email: string, otpCode: string, purpose: string = 'verification'): Promise<any> {
     try {
       const response = await api.post('/api/v1/otp/verify', {
         email,
         otp_code: otpCode,
         purpose
       });
       return response.data;
     } catch (error) {
       throw createApiError(error, 'Failed to verify OTP');
     }
   },

   /**
    * Resend verification OTP with cooldown check
    */
   async resendVerificationOTP(email: string): Promise<any> {
     try {
       const response = await api.post('/api/v1/auth/resend-verification-otp', {
         email,
         purpose: 'verification'
       });
       return response.data;
     } catch (error) {
       throw createApiError(error, 'Failed to resend verification OTP');
     }
   },

   // Add other methods like getUserInfo if needed, making sure they use the 
   // upcoming configured axios instance (apiClient)

};
