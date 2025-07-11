import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './services/auth/hook';
import { LandingPage } from './modules/landing/LandingPage';
import { Login } from './modules/auth/pages/Login';
import { Register } from './modules/auth/pages/Register';
import { OTPVerification } from './modules/auth/pages/OTPVerification';
import { AuthLayout } from './modules/auth/layout';
import { Layout } from '@/components/layout/Layout';
import { ThemeProvider } from 'next-themes';
import OnboardingLayout from './modules/onboarding/layout';
import { Welcome } from './modules/onboarding/pages/Welcome';
import { Profile } from './modules/onboarding/pages/Profile';
import DashboardLayout from './modules/dashboard/layout';
import { MainDashboard } from './modules/dashboard/pages/MainDashboard';
import { ResumeGenerator } from './modules/dashboard/pages/ResumeGenerator';

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

// Public route component that redirects authenticated users to dashboard
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Auth route component that redirects authenticated users to dashboard
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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
          <Route path="templates" element={<div>Templates coming soon</div>} />
          <Route path="enhancer" element={<div>AI Enhancer coming soon</div>} />
          <Route path="evaluator" element={<div>Resume Evaluator coming soon</div>} />
          <Route path="generate" element={<ResumeGenerator />} />
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
