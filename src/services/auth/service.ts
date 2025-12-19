import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
// Only import types used by AuthService
import { LoginRequest, RegisterRequest, AuthResponse, User, PasswordResetRequest, PasswordResetComplete } from './types'; 
import { 
    saveAuthToken, 
    getAuthToken, 
    removeAuthToken, 
    saveRefreshToken, 
    getRefreshToken, 
    removeRefreshToken 
} from './utils';
import { extractApiErrorMessage } from '@/utils/error-utils'; 

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
    
    // Don't attempt token refresh for auth endpoints (login, register, refresh)
    // These endpoints should handle 401 errors directly
    const authEndpoints = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh'];
    const isAuthEndpoint = original?.url && authEndpoints.some(endpoint => original.url?.includes(endpoint));
    
    if (error.response?.status === 401 && original && !original._retry && !isAuthEndpoint) {
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

// Helper to create consistent error messages using shared utility
const createApiError = (error: unknown, fallbackKey: string = 'general.unexpected_error'): Error => {
    const message = extractApiErrorMessage(error, fallbackKey);
    return new Error(message);
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
      // Use shared error utility to extract user-friendly message
      const message = extractApiErrorMessage(error, 'auth.login_failed');
      throw new Error(message);
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
      // Use shared error utility to extract user-friendly message
      const message = extractApiErrorMessage(error, 'auth.registration_failed');
      throw new Error(message);
    }
  },

  /**
   * Logout user by calling backend logout endpoint and removing tokens
   */
  async logout(): Promise<void> {
    try {
      const token = getAuthToken();
      if (token) {
        // Call backend logout endpoint to blacklist the token
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.warn('Backend logout failed, but continuing with local logout');
        }
      }
    } catch (error) {
      console.warn('Error calling backend logout:', error);
      // Continue with local logout even if backend call fails
    } finally {
      // Always remove tokens locally
      removeAuthToken();
      removeRefreshToken();
      console.log("User logged out, tokens removed.");
    }
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
           // Use shared error utility to extract user-friendly message
           const message = extractApiErrorMessage(error, 'api.fetch_failed');
           throw new Error(message);
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
       throw createApiError(error, 'auth.otp_send_error');
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
       throw createApiError(error, 'auth.otp_verify_error');
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
      throw createApiError(error, 'auth.otp_resend_error');
    }
  },

  /**
   * Request password reset OTP
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<any> {
    try {
      const response = await api.post('/api/v1/otp/password-reset/request', data);
      return response.data;
    } catch (error) {
      throw createApiError(error, 'auth.password_reset_request_failed');
    }
  },

  /**
   * Complete password reset with OTP verification
   */
  async completePasswordReset(data: PasswordResetComplete): Promise<any> {
    try {
      const response = await api.post('/api/v1/otp/password-reset/complete', data);
      return response.data;
    } catch (error) {
      throw createApiError(error, 'auth.password_reset_failed');
    }
  },

  // Add other methods like getUserInfo if needed, making sure they use the 
  // upcoming configured axios instance (apiClient)

};
