import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './services/auth/hook';
import { LandingPage } from './modules/landing/LandingPage';
import { Login } from './modules/auth/pages/Login';
import { Register } from './modules/auth/pages/Register';
import { OTPVerification } from './modules/auth/pages/OTPVerification';
import { ForgotPassword } from './modules/auth/pages/ForgotPassword';
import { ResetPassword } from './modules/auth/pages/ResetPassword';
import { AuthLayout } from './modules/auth/layout';
import { Layout } from '@/components/layout/Layout';
import { ThemeProvider } from 'next-themes';
import OnboardingLayout from './modules/onboarding/layout';
import { Welcome } from './modules/onboarding/pages/Welcome';
import { Profile } from './modules/onboarding/pages/Profile';
import DashboardLayout from './modules/dashboard/layout';
import { MainDashboard } from './modules/dashboard/pages/MainDashboard';
import { ResumeGenerator } from './modules/dashboard/pages/ResumeGenerator';
import { ResumeEvaluator } from './modules/dashboard/pages/ResumeEvaluator';
import MyResumes from './modules/dashboard/pages/MyResumes';
import ResumeImport from './modules/dashboard/pages/ResumeImport';
import Account from './modules/dashboard/pages/Account';
import JobMatcher from './modules/dashboard/pages/JobMatcher';
import CoverLetterPage from './modules/dashboard/pages/CoverLetter';
import { checkProfileExists } from './services/user_profile/service';
import { useEffect, useState } from 'react';

// Protected route component that uses auth context
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public route component that redirects authenticated users appropriately
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);
  
  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      if (isAuthenticated && user && !isLoading) {
        setIsCheckingProfile(true);
        try {
          const profileCheck = await checkProfileExists();
          
          if (profileCheck.profile_exists) {
            // Profile exists, redirect to dashboard
            setShouldRedirect('/dashboard');
          } else {
            // Profile doesn't exist, redirect to onboarding
            setShouldRedirect('/onboarding/welcome');
          }
        } catch (profileError: any) {
          // Check if it's a 404 error (expected for users without profiles)
          if (profileError?.response?.status === 404 || 
              (profileError?.response?.data?.profile_exists === false)) {
            // Profile doesn't exist, redirect to onboarding
            setShouldRedirect('/onboarding/welcome');
          } else {
            // Other error - log it but default to onboarding for safety
            console.error('Error checking profile existence:', profileError);
            setShouldRedirect('/onboarding/welcome');
          }
        } finally {
          setIsCheckingProfile(false);
        }
      }
    };
    
    checkProfileAndRedirect();
  }, [isAuthenticated, user, isLoading]);
  
  // Show loading spinner while checking authentication or profile
  if (isLoading || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If user is authenticated, redirect based on profile check
  if (isAuthenticated && user && shouldRedirect) {
    return <Navigate to={shouldRedirect} replace />;
  }
  
  return <>{children}</>;
};

// Auth route component that redirects authenticated users appropriately
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);
  
  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      if (isAuthenticated && user && !isLoading) {
        setIsCheckingProfile(true);
        try {
          const profileCheck = await checkProfileExists();
          
          if (profileCheck.profile_exists) {
            // Profile exists, redirect to dashboard
            setShouldRedirect('/dashboard');
          } else {
            // Profile doesn't exist, redirect to onboarding
            setShouldRedirect('/onboarding/welcome');
          }
        } catch (profileError: any) {
          // Check if it's a 404 error (expected for users without profiles)
          if (profileError?.response?.status === 404 || 
              (profileError?.response?.data?.profile_exists === false)) {
            // Profile doesn't exist, redirect to onboarding
            setShouldRedirect('/onboarding/welcome');
          } else {
            // Other error - log it but default to onboarding for safety
            console.error('Error checking profile existence:', profileError);
            setShouldRedirect('/onboarding/welcome');
          }
        } finally {
          setIsCheckingProfile(false);
        }
      }
    };
    
    checkProfileAndRedirect();
  }, [isAuthenticated, user, isLoading]);
  
  // Show loading spinner while checking authentication or profile
  if (isLoading || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If user is authenticated, redirect based on profile check
  if (isAuthenticated && user && shouldRedirect) {
    return <Navigate to={shouldRedirect} replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public routes that redirect authenticated users to dashboard */}
        <Route path="/" element={
          <PublicRoute>
            <Layout><LandingPage /></Layout>
          </PublicRoute>
        } />
        
        {/* Auth routes that redirect authenticated users to dashboard */}
        <Route path="/login" element={
          <AuthRoute>
            <AuthLayout><Login /></AuthLayout>
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <AuthLayout><Register /></AuthLayout>
          </AuthRoute>
        } />
        <Route path="/verify-otp" element={
          <AuthRoute>
            <AuthLayout><OTPVerification /></AuthLayout>
          </AuthRoute>
        } />
        <Route path="/forgot-password" element={
          <AuthRoute>
            <AuthLayout><ForgotPassword /></AuthLayout>
          </AuthRoute>
        } />
        <Route path="/reset-password" element={
          <AuthRoute>
            <AuthLayout><ResetPassword /></AuthLayout>
          </AuthRoute>
        } />
        
        {/* Onboarding routes */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingLayout />
          </ProtectedRoute>
        }>
          <Route path="welcome" element={<Welcome />} />
          <Route path="profile" element={<Profile />} />
          <Route index element={<Navigate to="welcome" replace />} />
        </Route>
        
        {/* Dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MainDashboard />} />
          <Route path="resumes" element={<MyResumes />} />
          <Route path="account" element={<Account />} />
          <Route path="resume/:resumeId" element={<ResumeGenerator />} />
          <Route path="resume/new" element={<ResumeGenerator />} />
          <Route path="templates" element={<div>Templates coming soon</div>} />
          <Route path="enhancer" element={<div>AI Enhancer coming soon</div>} />
          <Route path="evaluator" element={<ResumeEvaluator />} />
          <Route path="job-matcher" element={<JobMatcher />} />
          <Route path="cover-letter" element={<CoverLetterPage />} />
          <Route path="generate" element={<ResumeImport />} />
          <Route path="upload" element={<div>Upload Resume coming soon</div>} />
          <Route path="schedule" element={<div>Schedule Review coming soon</div>} />
          <Route path="goals" element={<div>Career Goals coming soon</div>} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
