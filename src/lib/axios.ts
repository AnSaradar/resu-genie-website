import axios, { InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from '@/services/auth/utils'; // Removed saveAuthToken as it's not used directly here
import { AuthService } from '@/services/auth/service'; // Import AuthService to use refreshToken

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false; // Flag to prevent multiple refresh attempts
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = []; // Queue for requests that failed due to 401

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      // Type assertion needed because if error is null, token must be string
      prom.resolve(token as string); 
    }
  });
  failedQueue = [];
};

// Request interceptor to add the token
apiClient.interceptors.request.use(
  (config): InternalAxiosRequestConfig => {
    const token = getAuthToken();
    // Do not add token for auth endpoints like login, register, refresh
    const noAuthRequired = ['/auth/login/', '/auth/register/', '/auth/token/refresh/'].some(path => config.url?.includes(path));

    if (token && !noAuthRequired) {
        // Ensure config.headers exists
        config.headers = config.headers || {}; 
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const originalRequest = error.config;

    // Check if it's a 401 error and not a retry request and not a refresh token request itself
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== `${API_BASE_URL}/auth/token/refresh/`) {

      if (isRefreshing) {
        // If token is already refreshing, queue the original request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest); // Retry with the new token
        }).catch(err => {
          return Promise.reject(err); // Propagate the error if queue processing fails
        });
      }

      originalRequest._retry = true; // Mark as retry
      isRefreshing = true;

      try {
        const newAccessToken = await AuthService.refreshToken(); // Use the refreshToken method from AuthService

        if (newAccessToken) {
          console.log("Retrying original request with new token.");
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken); // Process queue with the new token
          return apiClient(originalRequest); // Retry the original request
        } else {
          // Refresh token failed (likely expired or invalid), logout handled in refreshToken
          console.error("Refresh token failed or missing. User logged out.");
           processQueue(new Error('Unable to refresh token. User logged out.'), null);
           // Optional: Redirect to login page
           // window.location.href = '/login';
           return Promise.reject(new Error('Unable to refresh token. User logged out.'));
        }
      } catch (refreshError) {
        console.error("Error during token refresh process:", refreshError);
        processQueue(refreshError, null); // Reject queued requests
        // Logout should have been handled within refreshToken if it failed
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For errors other than 401, just reject
    return Promise.reject(error);
  }
);

export default apiClient; 