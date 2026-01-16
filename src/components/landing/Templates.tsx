import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { getMessage } from "@/utils/messages";
import { useAppTranslation } from "@/i18n/hooks";
import { Trans } from "react-i18next";
import simpleTemplate from "@/assets/images/simple_template.jpg";
import jobscanTemplate from "@/assets/images/jobscan_template.jpg";
import moeyTemplate from "@/assets/images/moey_template.jpg";

interface TemplatesProps {
  onRegisterClick?: () => void;
}

export function Templates({ onRegisterClick }: TemplatesProps) {
  const { t } = useAppTranslation('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const templates = [
    {
      name: "MOEY",
      description: "A clean and professional resume template with modern design.",
      image: moeyTemplate,
      color: "blue",
    },
    {
      name: "SIMPLE",
      description: "Single-column, print-friendly style with concise contact row and bold section titles.",
      image: simpleTemplate,
      color: "purple",
    },
    {
      name: "JOBSCAN",
      description: "ATS-friendly template optimized for job scanning systems.",
      image: jobscanTemplate,
      color: "green",
    },
  ];

  return (
    <section id="templates" className="py-12 md:py-20 lg:py-24 xl:py-32 2xl:py-40">
      <div className="container px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="text-center max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto mb-12 md:mb-16 xl:mb-20 2xl:mb-24">
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 md:mb-4 xl:mb-5 2xl:mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Trans
              i18nKey="templates.title"
              ns="landing"
              components={{
                gradient: <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent" />
              }}
            />
          </motion.h2>
          <motion.p
            className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground px-4 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('templates.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <Carousel className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
            <CarouselContent>
              {templates.map((template, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2 xl:p-3 2xl:p-4 h-full">
                    <motion.div
                      className="relative group rounded-xl xl:rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-lg xl:shadow-xl 2xl:shadow-2xl h-full bg-card cursor-pointer"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => setSelectedTemplate(index)}
                    >
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img
                          src={template.image}
                          alt={template.name}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4 xl:p-5 2xl:p-6 space-y-3 xl:space-y-4 2xl:space-y-5">
                        <div>
                          <h3 className="font-semibold text-lg xl:text-xl 2xl:text-2xl leading-snug">{template.name}</h3>
                          <p className="text-sm xl:text-base 2xl:text-lg text-muted-foreground line-clamp-2 leading-relaxed">
                            {template.description}
                          </p>
                        </div>
                        <Button
                          className="w-full xl:text-base 2xl:text-lg xl:h-11 2xl:h-12"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onRegisterClick) {
                              const message = getMessage('toast.register_required');
                              toast(message, {
                                duration: 4000,
                                icon: 'ℹ️',
                              });
                              onRegisterClick();
                            }
                          }}
                        >
                          {t('templates.use_template')}
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-0 -translate-x-1/2 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" />
              <CarouselNext className="right-0 translate-x-1/2 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" />
            </div>
          </Carousel>
        </motion.div>

        {/* Template Preview Dialog */}
        <Dialog open={selectedTemplate !== null} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl max-h-[90vh] overflow-y-auto">
            {selectedTemplate !== null && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl xl:text-2xl 2xl:text-3xl leading-snug">{templates[selectedTemplate].name} {t('templates.preview_title_suffix')}</DialogTitle>
                  <DialogDescription className="text-base xl:text-lg 2xl:text-xl leading-relaxed">
                    {templates[selectedTemplate].description}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 xl:mt-6 2xl:mt-8">
                  <img
                    src={templates[selectedTemplate].image}
                    alt={templates[selectedTemplate].name}
                    className="w-full h-auto rounded-lg xl:rounded-xl 2xl:rounded-2xl shadow-lg xl:shadow-xl 2xl:shadow-2xl object-contain"
                  />
                </div>
                <div className="flex justify-end mt-4 xl:mt-6 2xl:mt-8">
                  <Button
                    className="xl:text-base 2xl:text-lg xl:h-11 2xl:h-12"
                    onClick={() => {
                      if (onRegisterClick) {
                        const message = getMessage('toast.register_required');
                        toast(message, {
                          duration: 4000,
                          icon: 'ℹ️',
                        });
                        onRegisterClick();
                        setSelectedTemplate(null);
                      }
                    }}
                  >
                    {t('templates.use_template')}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
} 