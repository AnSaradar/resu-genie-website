import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/services/auth/hook";
import { LoginRequest } from "@/services/auth/types";
import { toast } from "react-hot-toast";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, error } = useAuth();
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
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const loginData: LoginRequest = {
        email,
        password
      };
      
      await login(loginData);
      
      // If remember me is checked, we could set a longer expiration for the token
      // This would typically be handled on the backend
      
      toast.success("Login successful!");
      
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Check if the error is due to unverified email
      if (err.message && err.message.includes("Please verify your email")) {
        toast.error("Please verify your email before logging in.");
        navigate('/verify-otp', { 
          state: { 
            email: email,
            fromLogin: true,
            redirectTo: '/dashboard'
          } 
        });
        return;
      }
      
      toast.error(error || err.message || "Login failed. Please try again.");
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
        className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full bg-blue-200 dark:bg-blue-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20"
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
        className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full bg-cyan-200 dark:bg-cyan-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20"
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
                    Welcome Back
                  </span>
                </h1>
                <p className="mt-2 text-sm md:text-base text-muted-foreground">
                  Sign in to continue building your resume
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
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="h-10 md:h-11 text-sm md:text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <Label htmlFor="password" className="text-sm md:text-base">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs md:text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 min-h-[44px] flex items-center justify-start sm:justify-end"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    className="h-10 md:h-11 text-sm md:text-base"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 md:space-x-3">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) => 
                      setRememberMe(checked)
                    }
                    className="h-4 w-4 md:h-5 md:w-5"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm md:text-base font-normal cursor-pointer flex items-center py-2"
                  >
                    Remember me
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-10 md:h-11 text-sm md:text-base font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </motion.form>

              <motion.div
                className="text-center text-xs md:text-sm"
                variants={itemVariants}
              >
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 min-h-[44px] inline-flex items-center"
                  >
                    Sign up
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
