import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "react-hot-toast";
import { getMessage } from "@/utils/messages";
import imagineTemplate from "@/assets/images/imagine_template.jpg";
import jobscanTemplate from "@/assets/images/jobscan_template.jpg";
import moeyTemplate from "@/assets/images/moey_template.jpg";

interface TemplatesProps {
  onRegisterClick?: () => void;
}

export function Templates({ onRegisterClick }: TemplatesProps) {
  const templates = [
    {
      name: "MOEY",
      description: "A clean and professional resume template with modern design.",
      image: moeyTemplate,
      color: "blue",
    },
    {
      name: "IMAGINE",
      description: "A modern and visually engaging resume template with creative layout.",
      image: imagineTemplate,
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
    <section id="templates" className="py-12 md:py-20 lg:py-24">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Professional{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Resume Templates
            </span>
          </motion.h2>
          <motion.p
            className="text-base md:text-lg lg:text-xl text-muted-foreground px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose from our collection of ATS-optimized templates designed to
            impress employers and highlight your skills.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {templates.map((template, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2 h-full">
                    <motion.div
                      className="relative group rounded-xl overflow-hidden shadow-lg h-full bg-card"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img
                          src={template.image}
                          alt={template.name}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                        <Button
                          className="w-full"
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
                          Use This Template
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-0 -translate-x-1/2" />
              <CarouselNext className="right-0 translate-x-1/2" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
} 