import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function Templates() {
  const templates = [
    {
      name: "Professional",
      description: "A clean, professional template suitable for corporate roles.",
      image: "https://placehold.co/600x800/e6f7ff/007bff?text=Professional+Template",
      color: "blue",
    },
    {
      name: "Creative",
      description: "A modern, creative template for design and marketing roles.",
      image: "https://placehold.co/600x800/fff0f5/ff69b4?text=Creative+Template",
      color: "pink",
    },
    {
      name: "Executive",
      description: "An elegant template for senior management and executive positions.",
      image: "https://placehold.co/600x800/f0f0f0/333333?text=Executive+Template",
      color: "gray",
    },
    {
      name: "Technical",
      description: "A structured template highlighting technical skills and projects.",
      image: "https://placehold.co/600x800/f0fff0/2e8b57?text=Technical+Template",
      color: "green",
    },
    {
      name: "Minimalist",
      description: "A clean, minimalist design that lets your content shine.",
      image: "https://placehold.co/600x800/fff8dc/daa520?text=Minimalist+Template",
      color: "yellow",
    },
  ];

  return (
    <section id="templates" className="py-20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
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
            className="text-xl text-muted-foreground"
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <Button
                              className="w-full"
                              variant="secondary"
                            >
                              Use This Template
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
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

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button size="lg" className="text-base">
            View All Templates
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 