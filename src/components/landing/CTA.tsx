import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/i18n/hooks";
import { Trans } from "react-i18next";

interface CTAProps {
  onRegisterClick?: () => void;
}

export function CTA({ onRegisterClick }: CTAProps) {
  const { t } = useAppTranslation('landing');
  return (
    <section className="py-12 md:py-20 lg:py-24 xl:py-32 2xl:py-40 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 dark:from-blue-900/20 dark:to-cyan-900/20" />

      {/* Floating elements - optimized for mobile */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 rounded-full bg-blue-200 dark:bg-blue-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20 xl:opacity-25 2xl:opacity-30"
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
        className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 rounded-full bg-cyan-200 dark:bg-cyan-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20 xl:opacity-25 2xl:opacity-30"
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

      <div className="container relative z-10 px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl xl:rounded-3xl 2xl:rounded-[2rem] shadow-xl xl:shadow-2xl 2xl:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20"
          >
            <motion.h2
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 md:mb-4 xl:mb-5 2xl:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Trans
                i18nKey="cta.title"
                ns="landing"
                components={{
                  gradient: <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent" />
                }}
              />
            </motion.h2>
            <motion.p
              className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground mb-6 md:mb-8 xl:mb-10 2xl:mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('cta.description')}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 xl:gap-5 2xl:gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                size="lg" 
                className="text-sm md:text-base xl:text-lg 2xl:text-xl h-11 md:h-12 xl:h-14 2xl:h-16 w-full sm:w-auto"
                onClick={onRegisterClick}
              >
                {t('cta.primary')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-sm md:text-base xl:text-lg 2xl:text-xl h-11 md:h-12 xl:h-14 2xl:h-16 w-full sm:w-auto"
              >
                {t('cta.view_templates')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 