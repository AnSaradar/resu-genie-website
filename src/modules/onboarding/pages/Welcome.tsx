import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth/hook";

export function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleNext = () => {
    navigate("/onboarding/profile");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
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
        damping: 12,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-background min-h-screen flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 opacity-50" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-200 dark:bg-blue-900 blur-3xl opacity-20"
          animate={{
            y: ["-20px", "20px"],
            x: ["-10px", "10px"],
            scale: [1, 1.05, 1],
            transition: {
              y: {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              x: {
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              scale: {
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            },
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-200 dark:bg-cyan-900 blur-3xl opacity-20"
          animate={{
            y: ["20px", "-20px"],
            x: ["10px", "-10px"],
            scale: [1, 1.1, 1],
            transition: {
              y: {
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              x: {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              scale: {
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            },
          }}
        />
        
        {/* Smaller decorative shapes */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-pink-200 dark:bg-pink-800 blur-2xl opacity-20"
          animate={{
            y: ["15px", "-15px"],
            x: ["10px", "-10px"],
            transition: {
              duration: 3.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-32 h-32 rounded-full bg-purple-200 dark:bg-purple-800 blur-2xl opacity-20"
          animate={{
            y: ["-15px", "15px"],
            x: ["-10px", "10px"],
            transition: {
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-16">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-3">
            <motion.div 
              className="inline-block text-blue-600 dark:text-blue-400 text-6xl mb-6"
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              👋
            </motion.div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Welcome, {user?.first_name || "there"}!
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          >
            We're excited to help you create an amazing resume that stands out.
            <br />
            Let's start by building your personal profile.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full max-w-xs"
            >
              <Button 
                onClick={handleNext} 
                size="lg"
                className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Let's Get Started
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16"
          >
            <motion.div 
              className="flex justify-center space-x-4"
              animate={{
                y: ["0px", "-8px", "0px"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 opacity-70" />
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 opacity-70" />
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 opacity-70" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 