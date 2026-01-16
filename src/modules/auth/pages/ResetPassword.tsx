import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "@/services/auth/service";
import { PasswordResetComplete } from "@/services/auth/types";
import { toast } from "react-hot-toast";
import { ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useAppTranslation } from "@/i18n/hooks";

export function ResetPassword() {
  const { t } = useAppTranslation('auth');
  const { t: tCommon } = useAppTranslation('common');
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [email, setEmail] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect to forgot password
      navigate('/forgot-password');
    }
  }, [location.state, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return tCommon('validation.password_too_short');
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!otpCode || !newPassword || !confirmPassword) {
      toast.error(t('toast.fill_required_fields'));
      return;
    }

    if (otpCode.length !== 6) {
      toast.error(tCommon('validation.otp_invalid_length'));
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(tCommon('validation.password_mismatch'));
      return;
    }

    if (timeLeft <= 0) {
      toast.error(t('errors.otp_expired'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const resetData: PasswordResetComplete = {
        email,
        otp_code: otpCode,
        new_password: newPassword
      };
      
      await AuthService.completePasswordReset(resetData);
      
      setPasswordReset(true);
      toast.success(t('toast.password_reset_success'));
      
    } catch (err: any) {
      console.error("Password reset error:", err);
      
      // Handle specific error cases
      if (err.message && err.message.includes("expired")) {
        toast.error(t('errors.otp_expired'));
      } else if (err.message && err.message.includes("Invalid")) {
        toast.error(t('errors.otp_invalid'));
      } else if (err.message && err.message.includes("attempts")) {
        toast.error(t('errors.otp_too_many_attempts'));
      } else {
        toast.error(err.message || t('errors.password_reset_failed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsSubmitting(true);
      
      await AuthService.requestPasswordReset({ email });
      setTimeLeft(600); // Reset timer
      toast.success(t('toast.password_reset_code_resent'));
      
    } catch (err: any) {
      console.error("Resend code error:", err);
      toast.error(err.message || t('errors.password_reset_request_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (passwordReset) {
    return (
      <section className="relative overflow-hidden bg-background py-20 md:py-32 min-h-screen flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 opacity-50" />

        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-green-200 dark:bg-green-900 blur-3xl opacity-20"
          animate={{
            y: ["-10px", "10px"],
            transition: {
              y: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            },
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-200 dark:bg-emerald-900 blur-3xl opacity-20"
          animate={{
            y: ["10px", "-10px"],
            transition: {
              y: {
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            },
          }}
        />

        <div className="container relative z-10">
          <div className="max-w-md mx-auto">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="space-y-6 text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                      {t('forms.reset_password.success_title')}
                    </span>
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    {t('forms.reset_password.success_message')}
                  </p>
                </motion.div>

                <motion.div className="space-y-3" variants={itemVariants}>
                  <Button 
                    onClick={handleBackToLogin}
                    className="w-full"
                  >
                    {t('forms.reset_password.continue_to_sign_in')}
                  </Button>
                </motion.div>

                <motion.div
                  className="text-center text-sm"
                  variants={itemVariants}
                >
                  <p className="text-muted-foreground">
                    {t('forms.reset_password.need_help')}{" "}
                    <Link
                      to="/contact"
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      {t('forms.reset_password.contact_support')}
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32 min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 opacity-50" />

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200 dark:bg-blue-900 blur-3xl opacity-20"
        animate={{
          y: ["-10px", "10px"],
          transition: {
            y: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          },
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-200 dark:bg-cyan-900 blur-3xl opacity-20"
        animate={{
          y: ["10px", "-10px"],
          transition: {
            y: {
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          },
        }}
      />

      <div className="container relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="text-center" variants={itemVariants}>
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {t('forms.reset_password.title')}
                  </span>
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {t('forms.reset_password.subtitle')} <strong>{email}</strong> {t('forms.reset_password.and_new_password')}
                </p>
              </motion.div>

              {/* Timer */}
              <motion.div 
                className={`text-center text-sm font-medium ${
                  timeLeft <= 60 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                }`}
                variants={itemVariants}
              >
                {t('forms.reset_password.code_expires_in')} {formatTime(timeLeft)}
              </motion.div>

              <motion.form
                className="space-y-4"
                onSubmit={handleSubmit}
                variants={itemVariants}
              >
                <div className="space-y-2">
                  <Label htmlFor="otp">{t('forms.reset_password.otp_label')}</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder={t('forms.reset_password.otp_placeholder')}
                    value={otpCode}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtpCode(value);
                    }}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('forms.reset_password.otp_hint')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('forms.reset_password.new_password_label')}</Label>
                  <PasswordInput
                    id="newPassword"
                    placeholder={t('forms.reset_password.new_password_placeholder')}
                    value={newPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('forms.reset_password.new_password_hint')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('forms.reset_password.confirm_password_label')}</Label>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder={t('forms.reset_password.confirm_password_placeholder')}
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    showPassword={showConfirmPassword}
                    onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || timeLeft <= 0}
                >
                  {isSubmitting ? t('forms.reset_password.submitting') : t('forms.reset_password.submit')}
                </Button>
              </motion.form>

              <motion.div className="space-y-3" variants={itemVariants}>
                <Button 
                  variant="outline" 
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? t('forms.otp.resending') : t('forms.reset_password.resend_code')}
                </Button>
              </motion.div>

              <motion.div
                className="text-center text-sm"
                variants={itemVariants}
              >
                <p className="text-muted-foreground">
                  {t('forms.reset_password.remember_password')}{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    {t('forms.reset_password.sign_in')}
                  </Link>
                </p>
              </motion.div>

              <motion.div
                className="relative"
                variants={itemVariants}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
              </motion.div>

              <motion.div
                className="text-center"
                variants={itemVariants}
              >
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('forms.reset_password.back_to_email_step')}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
