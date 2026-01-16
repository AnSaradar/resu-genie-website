import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/services/auth/service';
import toast from 'react-hot-toast';
import { useAppTranslation } from '@/i18n/hooks';

interface OTPVerificationProps {
  email?: string;
  redirectTo?: string;
}

export function OTPVerification() {
  const { t } = useAppTranslation('auth');
  const { t: tCommon } = useAppTranslation('common');
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
      newErrors.email = tCommon('validation.field_required');
    } else if (!validateEmail(email)) {
      newErrors.email = tCommon('validation.email_invalid');
    }

    if (!otpCode.trim()) {
      newErrors.otpCode = tCommon('validation.otp_required');
    } else if (!validateOTP(otpCode)) {
      newErrors.otpCode = tCommon('validation.otp_invalid_length');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsVerifying(true);

    try {
      const response = await AuthService.verifyOTP(email, otpCode, 'verification');
      
      if (response.signal === 'Email verified successfully') {
        toast.success(t('toast.email_verified'));
        
        // Redirect to login or original destination
        if (location.state?.fromLogin) {
          navigate('/login', { 
            state: { 
              email, 
              message: t('toast.email_verified')
            } 
          });
        } else {
          navigate('/login');
        }
      } else {
        toast.success(response.message || t('toast.otp_verified'));
        navigate(redirectTo);
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      if (error.message?.includes('Invalid or expired OTP')) {
        setErrors({ otpCode: t('errors.otp_invalid') });
        toast.error(t('errors.otp_invalid'));
      } else if (error.message?.includes('Too many attempts')) {
        setErrors({ otpCode: t('errors.otp_too_many_attempts') });
        toast.error(t('errors.otp_too_many_attempts'));
        setOtpCode('');
      } else {
        toast.error(error.message || t('errors.otp_verify_error'));
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email.trim()) {
      setErrors({ email: tCommon('validation.field_required') });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: tCommon('validation.email_invalid') });
      return;
    }

    setIsResending(true);
    setErrors({});

    try {
      await AuthService.resendVerificationOTP(email);
      toast.success(t('toast.otp_sent'));
      setCooldownTime(60); // Start 60-second cooldown
      setOtpCode(''); // Clear previous OTP
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      
      if (error.message?.includes('Please wait before requesting')) {
        toast.error(t('errors.otp_resend_cooldown'));
      } else if (error.message?.includes('already verified')) {
        toast.error(t('errors.user_already_verified'));
        navigate('/login');
      } else {
        toast.error(error.message || t('errors.otp_resend_error'));
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
            <CardTitle className="text-2xl font-bold">{t('forms.otp.title')}</CardTitle>
            <CardDescription>
              {t('forms.otp.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('forms.otp.email_label')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('forms.otp.email_placeholder')}
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
                <Label htmlFor="otp">{t('forms.otp.otp_label')}</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder={t('forms.otp.otp_placeholder')}
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
                {isVerifying ? t('forms.otp.verifying') : t('forms.otp.verify')}
              </Button>
            </form>

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('forms.otp.didnt_receive')}
              </p>
              
              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={isResending || cooldownTime > 0}
                className="w-full"
              >
                {isResending ? t('forms.otp.resending') : 
                 cooldownTime > 0 ? t('forms.otp.resend_cooldown', { seconds: cooldownTime }) : 
                 t('forms.otp.resend')}
              </Button>

              <Button
                variant="ghost"
                onClick={handleBackToLogin}
                className="w-full text-sm"
              >
                {t('forms.otp.back_to_login')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 