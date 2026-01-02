import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from './service';
import { AuthContextType, LoginRequest, RegisterRequest, User, AuthResponse } from './types';
import { checkProfileExists } from '@/services/user_profile/service';
import { extractApiErrorMessage } from '@/utils/error-utils';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have a token and validate it
        const isAuthenticated = AuthService.isAuthenticated();
        
        if (isAuthenticated) {
          // Validate the token by fetching user data
          const isValid = await AuthService.validateToken();
          
          if (isValid) {
            // Get current user data
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
            
            // Handle automatic redirection for authenticated users
            const currentPath = window.location.pathname;
            const publicPaths = ['/', '/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'];
            
            // If user is on a public path and authenticated, redirect appropriately
            if (publicPaths.includes(currentPath)) {
              // Check user role and redirect accordingly
              if (userData.role === 'admin') {
                // Admin users go directly to admin dashboard
                navigate('/admin', { replace: true });
              } else {
                // Regular users follow normal flow: check profile
                try {
                  const profileCheck = await checkProfileExists();
                  
                  if (profileCheck.profile_exists) {
                    // Profile exists, navigate to dashboard
                    navigate('/dashboard', { replace: true });
                  } else {
                    // Profile doesn't exist, navigate to onboarding
                    navigate('/onboarding/welcome', { replace: true });
                  }
                } catch (profileError) {
                  console.error('Error checking profile existence:', profileError);
                  // If profile check fails, default to onboarding for safety
                  navigate('/onboarding/welcome', { replace: true });
                }
              }
            }
          } else {
            // Token is invalid, clear auth state
            AuthService.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Clear invalid auth state
        AuthService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Parse API error using shared error utility
  const parseApiError = (err: any): string => {
    return extractApiErrorMessage(err, 'general.unexpected_error');
  };

  // Login function
  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AuthService.login(data);
      
      // Get user data after successful login
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      
      // Check user role and redirect accordingly
      if (userData.role === 'admin') {
        // Admin users go directly to admin dashboard
        navigate('/admin');
      } else {
        // Regular users follow normal flow: check profile
        try {
          const profileCheck = await checkProfileExists();
          
          if (profileCheck.profile_exists) {
            // Profile exists, can navigate to dashboard
            navigate('/dashboard');
          } else {
            // Profile doesn't exist, navigate to onboarding
            navigate('/onboarding/welcome');
          }
        } catch (profileError) {
          console.error('Error checking profile existence:', profileError);
          // If profile check fails, default to onboarding for safety
          navigate('/onboarding/welcome');
        }
      }
      
    } catch (err) {
      const errorMessage = parseApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AuthService.register(data);
      // Don't set user or navigate after registration
      // Just return the response so the component can handle navigation
      return response;
    } catch (err) {
      const errorMessage = parseApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if backend call fails
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If refresh fails, user might be logged out, so clear user state
      setUser(null);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
