const AUTH_TOKEN_KEY = 'authToken'; // Key for storing the token in localStorage
const REFRESH_TOKEN_KEY = 'refreshToken'; // Key for the refresh token

/**
 * Saves the authentication token to localStorage.
 * @param token - The authentication token string.
 */
export const saveAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') { // Ensure localStorage is available
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving auth token to localStorage:", error);
      // Handle potential storage errors (e.g., storage full)
    }
  }
};

/**
 * Retrieves the authentication token from localStorage.
 * @returns The token string or null if not found or not available.
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting auth token from localStorage:", error);
      return null;
    }
  }
  return null; // Return null if localStorage is not available (SSR)
};

/**
 * Removes the authentication token from localStorage.
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Error removing auth token from localStorage:", error);
    }
  }
};

// --- Refresh Token Functions ---

/**
 * Saves the refresh token to localStorage.
 * @param token - The refresh token string.
 */
export const saveRefreshToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving refresh token to localStorage:", error);
    }
  }
};

/**
 * Retrieves the refresh token from localStorage.
 * @returns The refresh token string or null if not found or not available.
 */
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token from localStorage:", error);
      return null;
    }
  }
  return null;
};

/**
 * Removes the refresh token from localStorage.
 */
export const removeRefreshToken = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error removing refresh token from localStorage:", error);
    }
  }
}; 