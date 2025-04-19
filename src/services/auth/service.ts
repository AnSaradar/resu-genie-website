import axios from 'axios';
// Only import types used by AuthService
import { LoginRequest, RegisterRequest, AuthResponse } from './types'; 
import { 
    saveAuthToken, 
    getAuthToken, 
    removeAuthToken, 
    saveRefreshToken, 
    getRefreshToken, 
    removeRefreshToken 
} from './utils'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login/`, data);
      const authData = response.data;

      if (authData.access_token) {
        saveAuthToken(authData.access_token);
      }
      if (authData.refresh_token) {
          saveRefreshToken(authData.refresh_token);
      }

      return authData;
    } catch (error) {
        console.error('Login error:', error);
        throw createApiError(error, 'Login failed. Please check your credentials.');
    }
  },

  /**
   * Register a new user
   * @param data - Registration data
   * @returns Authentication response
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register/`, data);
      const authData = response.data;

      if (authData.access_token) {
        saveAuthToken(authData.access_token);
      }
      if (authData.refresh_token) {
          saveRefreshToken(authData.refresh_token);
      }

      return authData;
    } catch (error) {
      console.error('Registration error:', error);
      throw createApiError(error, 'Registration failed. Please try again.');
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
    return !!getAuthToken();
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
               `${API_BASE_URL}/auth/token/refresh/`, 
               { refresh: currentRefreshToken }
           );
           const newAccessToken = response.data.access_token; 
           if (newAccessToken) {
               saveAuthToken(newAccessToken);
               console.log("Token refreshed successfully.");
               return newAccessToken;
           }
           throw new Error("No access token received in refresh response.");
       } catch (error) {
           console.error("Token refresh failed:", error);
           this.logout();
           return null;
       }
   },

   // Add other methods like getUserInfo if needed, making sure they use the 
   // upcoming configured axios instance (apiClient)

};
