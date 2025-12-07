import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/services/auth/hook";
import { RegisterRequest } from "@/services/auth/types";
import { toast } from "react-hot-toast";

export function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Clear API error when form changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [firstName, lastName, email, phone, password, confirmPassword, agreeTerms, clearError, error]);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid && email.length > 0) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(null);
    }
    
    return isValid;
  };

  // Phone validation
  const validatePhone = (phone: string): boolean => {
    // If phone is empty, it's optional
    if (!phone) return true;
    
    // Basic international phone regex
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const isValid = phoneRegex.test(phone);
    
    if (!isValid && phone.length > 0) {
      setPhoneError("Please enter a valid phone number (e.g., +1234567890)");
    } else {
      setPhoneError(null);
    }
    
    return isValid;
  };

  // Password validation
  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    
    if (!/\d/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    
    setPasswordError(null);
    return true;
  };

  // Confirm password validation
  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    const isValid = password === confirmPassword;
    
    if (!isValid && confirmPassword.length > 0) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError(null);
    }
    
    return isValid;
  };

  // Validate fields on change
  useEffect(() => {
    if (email) validateEmail(email);
  }, [email]);

  useEffect(() => {
    if (phone) validatePhone(phone);
  }, [phone]);

  useEffect(() => {
    if (password) validatePassword(password);
  }, [password]);

  useEffect(() => {
    if (confirmPassword) validateConfirmPassword(password, confirmPassword);
  }, [confirmPassword, password]);

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
    
    // Run all validations
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);
    
    // Check required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Check validations
    if (!isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid) {
      toast.error("Please fix the validation errors");
      return;
    }
    
    if (!agreeTerms) {
      toast.error("You must agree to the Terms of Service and Privacy Policy");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const registerData: RegisterRequest = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone: phone || "" // Send empty string if no phone provided
      };
      
      const response = await register(registerData);
      
      // Check if registration requires email verification
      if (response && response.requires_verification) {
        toast.success("Registration successful! Please check your email for verification code.");
        navigate('/verify-otp', { 
          state: { 
            email: email,
            fromRegistration: true,
            redirectTo: '/dashboard'
          } 
        });
      } else {
      toast.success("Registration successful! Please log in.");
      navigate('/login');
      }
      
    } catch (err) {
      console.error("Registration error:", err);
      
      // Extract error message from the error object
      let errorMessage = "Registration failed. Please try again.";
      if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = err.message as string;
      }
      
      // Display error message using toast
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-20 lg:py-32 min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 opacity-50" />

      {/* Floating elements - optimized for mobile */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full bg-blue-200 dark:bg-blue-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20"
        animate={{
          y: ["-10px", "10px"],
          transition: {
            y: {
              duration: 2.2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          },
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full bg-cyan-200 dark:bg-cyan-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20"
        animate={{
          y: ["10px", "-10px"],
          transition: {
            y: {
              duration: 2.7,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          },
        }}
      />

      <div className="container relative z-10 px-4 md:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="space-y-4 md:space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="text-center" variants={itemVariants}>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Create Account
                  </span>
                </h1>
                <p className="mt-2 text-sm md:text-base text-muted-foreground">
                  Join ResuGenie and start building your professional resume
                </p>
              </motion.div>

              {error && (
                <motion.div 
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 md:p-4 rounded-md text-xs md:text-sm"
                  variants={itemVariants}
                >
                  {error}
                </motion.div>
              )}

              <motion.form
                className="space-y-4 md:space-y-5"
                onSubmit={handleSubmit}
                variants={itemVariants}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm md:text-base">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                      className="h-10 md:h-11 text-sm md:text-base"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm md:text-base">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                      className="h-10 md:h-11 text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className={`h-10 md:h-11 text-sm md:text-base ${emailError ? "border-red-500" : ""}`}
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm md:text-base">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                    className={`h-10 md:h-11 text-sm md:text-base ${phoneError ? "border-red-500" : ""}`}
                  />
                  {phoneError && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{phoneError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm md:text-base">Password</Label>
                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className={`h-10 md:h-11 text-sm md:text-base ${passwordError ? "border-red-500" : ""}`}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    required
                  />
                  {passwordError && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{passwordError}</p>
                  )}
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    Password must be at least 8 characters and contain at least one number
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm md:text-base">Confirm Password</Label>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    className={`h-10 md:h-11 text-sm md:text-base ${confirmPasswordError ? "border-red-500" : ""}`}
                    showPassword={showConfirmPassword}
                    onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    required
                  />
                  {confirmPasswordError && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{confirmPasswordError}</p>
                  )}
                </div>

                <div className="flex items-start space-x-2 md:space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked: boolean) => 
                      setAgreeTerms(checked)
                    }
                    className="h-4 w-4 md:h-5 md:w-5 mt-1 flex-shrink-0"
                    required
                  />
                  <Label
                    htmlFor="terms"
                    className="text-xs md:text-sm font-normal cursor-pointer flex items-start py-2"
                  >
                    <span className="leading-relaxed">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 underline"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-10 md:h-11 text-sm md:text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </motion.form>

              <motion.div
                className="text-center text-xs md:text-sm"
                variants={itemVariants}
              >
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 min-h-[44px] inline-flex items-center"
                  >
                    Sign in
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
                className="grid grid-cols-2 gap-3"
                variants={itemVariants}
              >
             </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
