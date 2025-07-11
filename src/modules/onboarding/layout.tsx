import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckProfileExists } from '@/services/user_profile/hook';
import { useAuth } from '@/services/auth/hook';

export default function OnboardingLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: profileCheck, isLoading: profileLoading, error } = useCheckProfileExists();

  useEffect(() => {
    // Only check profile if user is authenticated and not loading
    if (!authLoading && isAuthenticated) {
      if (!profileLoading && profileCheck) {
        if (profileCheck.profile_exists) {
          // User already has a profile, redirect to dashboard
          navigate('/dashboard');
        }
      }
    } else if (!authLoading && !isAuthenticated) {
      // User is not authenticated, redirect to login
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, profileLoading, profileCheck, navigate]);

  // Show loading while checking authentication or profile
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state if profile check failed
  if (error) {
    console.error('Profile check error:', error);
    // Continue with onboarding if there's an error (safer approach)
  }

  return <Outlet />;
} 