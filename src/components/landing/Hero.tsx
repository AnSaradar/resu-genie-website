import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppTranslation } from "@/i18n/hooks";

interface HeroProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export function Hero({ onLoginClick, onRegisterClick }: HeroProps) {
  const { t } = useAppTranslation("landing");
  const [typedText, setTypedText] = useState("");
  const fullText = t("hero.typewriter");
  const typingSpeed = 80;

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }
  }, [typedText, fullText]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        damping: 10,
      },
    },
  };

  const floatingAnimation = {
    y: ["-10px", "10px"],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-20 lg:py-32 xl:py-40 2xl:py-48">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 opacity-50" />

      {/* Floating elements - optimized for mobile */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 rounded-full bg-blue-200 dark:bg-blue-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20 xl:opacity-25 2xl:opacity-30"
        animate={floatingAnimation}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 rounded-full bg-cyan-200 dark:bg-cyan-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20 xl:opacity-25 2xl:opacity-30"
        animate={{
          ...floatingAnimation,
          transition: {
            y: {
              ...floatingAnimation.transition.y,
              delay: 0.5,
            },
          },
        }}
      />

      <div className="container relative z-10 px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <motion.div
          className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto text-center space-y-6 md:space-y-8 xl:space-y-10 2xl:space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="space-y-3 md:space-y-4 xl:space-y-5 2xl:space-y-6"
            variants={itemVariants}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {t("hero.title")}
              </span>
            </h1>
            <div className="min-h-[3rem] md:min-h-[4rem] lg:min-h-[5rem] xl:min-h-[6rem] 2xl:min-h-[7rem] flex items-center justify-center px-4">
              <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold leading-snug">
                {typedText}
                <span className="animate-blink">|</span>
              </h2>
            </div>
          </motion.div>

          <motion.p
            className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground mt-6 md:mt-8 xl:mt-10 2xl:mt-12 px-4 leading-relaxed"
            variants={itemVariants}
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 md:gap-4 xl:gap-5 2xl:gap-6 justify-center pt-4 px-4"
            variants={itemVariants}
          >
            <Button 
              size="lg" 
              className="text-sm md:text-base xl:text-lg 2xl:text-xl h-11 md:h-12 xl:h-14 2xl:h-16 w-full sm:w-auto"
              onClick={onRegisterClick}
            >
              {t("hero.cta.primary")}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-sm md:text-base xl:text-lg 2xl:text-xl h-11 md:h-12 xl:h-14 2xl:h-16 w-full sm:w-auto"
              onClick={onLoginClick}
            >
              {t("hero.cta.secondary")}
            </Button>
          </motion.div>

          <motion.div
            className="pt-8 md:pt-12 xl:pt-16 2xl:pt-20 flex justify-center px-4"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl aspect-[16/9] bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg xl:rounded-xl 2xl:rounded-2xl shadow-2xl overflow-hidden">
              {/* Resume preview mockup */}
              <motion.div
                className="absolute inset-4 bg-white dark:bg-gray-800 rounded shadow-lg"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
              >
                {/* Resume content mockup */}
                <div className="p-6 md:p-8 xl:p-10 2xl:p-12 space-y-4 xl:space-y-5 2xl:space-y-6">
                  <div className="h-8 w-48 bg-blue-100 dark:bg-blue-800 rounded-md" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-md" />
                    <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-700 rounded-md" />
                    <div className="h-4 w-4/6 bg-gray-100 dark:bg-gray-700 rounded-md" />
                  </div>
                  <div className="pt-4">
                    <div className="h-6 w-32 bg-blue-100 dark:bg-blue-800 rounded-md" />
                    <div className="mt-2 space-y-2">
                      <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-md" />
                      <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-700 rounded-md" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="h-6 w-32 bg-blue-100 dark:bg-blue-800 rounded-md" />
                    <div className="mt-2 space-y-2">
                      <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-md" />
                      <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-700 rounded-md" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="pt-6 md:pt-8 xl:pt-10 2xl:pt-12 flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 px-4"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                className="w-[18px] h-[18px] md:w-5 md:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-xs md:text-sm xl:text-base 2xl:text-lg">{t("hero.badges.ats")}</span>
            </div>
            <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                className="w-[18px] h-[18px] md:w-5 md:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-xs md:text-sm xl:text-base 2xl:text-lg">{t("hero.badges.ai")}</span>
            </div>
            <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                className="w-[18px] h-[18px] md:w-5 md:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-xs md:text-sm xl:text-base 2xl:text-lg">{t("hero.badges.templates")}</span>
            </div>
            <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                className="w-[18px] h-[18px] md:w-5 md:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="text-xs md:text-sm xl:text-base 2xl:text-lg">{t("hero.badges.download")}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 