import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './services/auth/hook';
import { LandingPage } from './modules/landing/LandingPage';
import { Login } from './modules/auth/pages/Login';
import { Register } from './modules/auth/pages/Register';
import { AuthLayout } from './modules/auth/layout';
import { Layout } from '@/components/layout/Layout';
import { ThemeProvider } from 'next-themes';
import OnboardingLayout from './modules/onboarding/layout';
import { Welcome } from './modules/onboarding/pages/Welcome';
import { Profile } from './modules/onboarding/pages/Profile';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
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
            {/* Public routes */}
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            
            {/* Auth routes */}
            <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
            
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
            
            {/* Protected routes */}
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <div>Dashboard (to be implemented)</div>
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
