import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from './service';
import { AuthContextType, LoginRequest, RegisterRequest, User, AuthResponse } from './types';
import { checkProfileExists } from '@/services/user_profile/service';

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
          } else {
            // Token is invalid, clear auth state
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
  }, []);

  // Parse API error
  const parseApiError = (err: any): string => {
    // Handle error object from fetch API
    if (err instanceof Error) {
      return err.message;
    }
    
    // Handle error responses from the server
    if (err && typeof err === 'object') {
      // Check for standard error format
      if (err.message) {
        return err.message;
      }
      
      // Check for validation errors
      if (err.errors) {
        if (Array.isArray(err.errors)) {
          return err.errors.join(', ');
        }
        
        if (typeof err.errors === 'object') {
          const errorMessages = Object.values(err.errors).flat();
          return errorMessages.join(', ');
        }
      }
    }
    
    // Default error message
    return 'An unexpected error occurred. Please try again.';
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
      
      // Check if user has completed profile after successful login
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
  const logout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/login');
  };

  // Clear error
  const clearError = () => {
    setError(null);
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
    clearError
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
