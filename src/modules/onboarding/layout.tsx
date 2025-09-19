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
      if (!profileLoading) {
        if (profileCheck && profileCheck.profile_exists) {
          // User already has a profile, redirect to dashboard
          navigate('/dashboard');
        } else if (error) {
          // Profile check failed (likely 404 - no profile exists)
          // This is expected for new users, continue with onboarding
          console.log('No profile found, continuing with onboarding');
        }
        // If profileCheck is null/undefined and no error, continue with onboarding
      }
    } else if (!authLoading && !isAuthenticated) {
      // User is not authenticated, redirect to login
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, profileLoading, profileCheck, error, navigate]);

  // Show loading while checking authentication or profile
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state if profile check failed (but not 404s which are expected)
  if (error && !error.message?.includes('404')) {
    console.error('Profile check error:', error);
    // Continue with onboarding if there's an unexpected error (safer approach)
  }

  return <Outlet />;
} 