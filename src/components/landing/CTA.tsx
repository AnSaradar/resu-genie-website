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
    <section className="py-12 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 dark:from-blue-900/20 dark:to-cyan-900/20" />

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
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 lg:p-12"
          >
            <motion.h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4"
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
              className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('cta.description')}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                size="lg" 
                className="text-sm md:text-base h-11 md:h-12 w-full sm:w-auto"
                onClick={onRegisterClick}
              >
                {t('cta.primary')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-sm md:text-base h-11 md:h-12 w-full sm:w-auto"
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