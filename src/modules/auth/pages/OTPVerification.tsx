import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/services/auth/service';
import toast from 'react-hot-toast';

interface OTPVerificationProps {
  email?: string;
  redirectTo?: string;
}

export function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state or props
  const emailFromState = location.state?.email;
  const redirectTo = location.state?.redirectTo || '/dashboard';
  
  const [email, setEmail] = useState<string>(emailFromState || '');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Start cooldown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  // Auto-send OTP if email is provided from registration
  useEffect(() => {
    if (emailFromState && location.state?.fromRegistration) {
      // OTP already sent from registration, just start cooldown
      setCooldownTime(60);
    }
  }, [emailFromState, location.state]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateOTP = (otp: string): boolean => {
    return /^\d{6}$/.test(otp);
  };

  const handleVerifyOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!otpCode.trim()) {
      newErrors.otpCode = 'OTP code is required';
    } else if (!validateOTP(otpCode)) {
      newErrors.otpCode = 'OTP must be 6 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsVerifying(true);

    try {
      const response = await AuthService.verifyOTP(email, otpCode, 'verification');
      
      if (response.signal === 'Email verified successfully') {
        toast.success('Email verified successfully! You can now login.');
        
        // Redirect to login or original destination
        if (location.state?.fromLogin) {
          navigate('/login', { 
            state: { 
              email, 
              message: 'Email verified successfully. Please login to continue.' 
            } 
          });
        } else {
          navigate('/login');
        }
      } else {
        toast.success(response.message || 'OTP verified successfully!');
        navigate(redirectTo);
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      if (error.message?.includes('Invalid or expired OTP')) {
        setErrors({ otpCode: 'Invalid or expired OTP code' });
        toast.error('Invalid or expired OTP code');
      } else if (error.message?.includes('Too many attempts')) {
        setErrors({ otpCode: 'Too many attempts. Please request a new OTP.' });
        toast.error('Too many attempts. Please request a new OTP.');
        setOtpCode('');
      } else {
        toast.error(error.message || 'Failed to verify OTP');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email.trim()) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsResending(true);
    setErrors({});

    try {
      await AuthService.resendVerificationOTP(email);
      toast.success('Verification code sent to your email!');
      setCooldownTime(60); // Start 60-second cooldown
      setOtpCode(''); // Clear previous OTP
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      
      if (error.message?.includes('Please wait before requesting')) {
        toast.error('Please wait before requesting another OTP');
      } else if (error.message?.includes('already verified')) {
        toast.error('Email is already verified');
        navigate('/login');
      } else {
        toast.error(error.message || 'Failed to resend OTP');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              Enter the 6-digit verification code sent to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                  disabled={!!emailFromState} // Disable if email came from navigation
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtpCode(value);
                  }}
                  className={`text-center text-lg tracking-widest ${errors.otpCode ? 'border-red-500' : ''}`}
                  maxLength={6}
                />
                {errors.otpCode && (
                  <p className="text-sm text-red-500">{errors.otpCode}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isVerifying || !otpCode || otpCode.length !== 6}
              >
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn't receive the code?
              </p>
              
              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={isResending || cooldownTime > 0}
                className="w-full"
              >
                {isResending ? 'Sending...' : 
                 cooldownTime > 0 ? `Resend in ${cooldownTime}s` : 
                 'Resend Code'}
              </Button>

              <Button
                variant="ghost"
                onClick={handleBackToLogin}
                className="w-full text-sm"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 