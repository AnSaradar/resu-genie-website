import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth/service";
import { PasswordResetRequest } from "@/services/auth/types";
import { toast } from "react-hot-toast";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useAppTranslation } from "@/i18n/hooks";

export function ForgotPassword() {
  const { t } = useAppTranslation('auth');
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('toast.fill_required_fields'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const resetData: PasswordResetRequest = {
        email
      };
      
      await AuthService.requestPasswordReset(resetData);
      
      setEmailSent(true);
      toast.success(t('toast.password_reset_code_sent'));
      
    } catch (err: any) {
      console.error("Password reset request error:", err);
      toast.error(err.message || t('errors.password_reset_request_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsSubmitting(true);
      
      const resetData: PasswordResetRequest = {
        email
      };
      
      await AuthService.requestPasswordReset(resetData);
      toast.success(t('toast.password_reset_code_resent'));
      
    } catch (err: any) {
      console.error("Resend code error:", err);
      toast.error(err.message || t('errors.password_reset_request_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToReset = () => {
    navigate('/reset-password', { 
      state: { 
        email: email 
      } 
    });
  };

  if (emailSent) {
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
                      {t('forms.forgot_password.email_sent_title')}
                    </span>
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    {t('forms.forgot_password.email_sent_message')} <strong>{email}</strong>
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                  variants={itemVariants}
                >
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">{t('forms.forgot_password.important')}</p>
                      <ul className="space-y-1 text-xs">
                        <li>• {t('forms.forgot_password.code_expires')}</li>
                        <li>• {t('forms.forgot_password.check_spam')}</li>
                        <li>• {t('forms.forgot_password.never_share')}</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div className="space-y-3" variants={itemVariants}>
                  <Button 
                    onClick={handleContinueToReset}
                    className="w-full"
                  >
                    {t('forms.forgot_password.enter_reset_code')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleResendCode}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? t('forms.otp.resending') : t('forms.forgot_password.resend_code')}
                  </Button>
                </motion.div>

                <motion.div
                  className="text-center text-sm"
                  variants={itemVariants}
                >
                  <p className="text-muted-foreground">
                    {t('forms.forgot_password.remember_password')}{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      {t('forms.forgot_password.sign_in')}
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
                    {t('forms.forgot_password.title')}
                  </span>
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {t('forms.forgot_password.subtitle')}
                </p>
              </motion.div>

              <motion.form
                className="space-y-4"
                onSubmit={handleSubmit}
                variants={itemVariants}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">{t('forms.forgot_password.email_label')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('forms.forgot_password.email_placeholder')}
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('forms.forgot_password.submitting') : t('forms.forgot_password.submit')}
                </Button>
              </motion.form>

              <motion.div
                className="text-center text-sm"
                variants={itemVariants}
              >
                <p className="text-muted-foreground">
                  {t('forms.forgot_password.remember_password')}{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    {t('forms.forgot_password.sign_in')}
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
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('forms.forgot_password.back_to_sign_in')}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
