import { motion } from "framer-motion";
import { FileText, SearchCheck, ClipboardList } from "lucide-react";

export function Features() {
  const features = [
    {
      id: "cover-letter",
      icon: FileText,
      title: "Cover Letter",
      description:
        "Generate tailored cover letters that mirror the job description and your experience so you can apply in minutes, not hours.",
    },
    {
      id: "job-matcher",
      icon: SearchCheck,
      title: "Job Matcher",
      description:
        "Paste any job description and instantly see how well you match, with concrete suggestions to tweak your resume for a better fit.",
    },
    {
      id: "resume-evaluator",
      icon: ClipboardList,
      title: "Resume Evaluator",
      description:
        "Get an instant, AI-powered score and actionable feedback on your resume’s clarity, impact, and ATS readiness.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Each feature section will slide in horizontally:
  // - Even index (0, 2, 4, ...) from the left
  // - Odd index (1, 3, 5, ...) from the right
  const itemVariants = {
    hidden: (custom: number) => ({
      opacity: 0,
      x: custom % 2 === 0 ? -60 : 60,
    }),
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14,
      },
    }),
  };

  return (
    <section id="features" className="py-12 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Your AI Toolkit for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Smarter Applications
            </span>
          </motion.h2>
          <motion.p
            className="text-base md:text-lg lg:text-xl text-muted-foreground px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Three focused tools that work together to write stronger cover letters,
            target roles more effectively, and continuously improve your resume.
          </motion.p>
        </div>

        <motion.div
          className="space-y-16 md:space-y-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isReversed = index % 2 === 1;

            return (
              <motion.section
                key={feature.id ?? index}
                id={feature.id}
                variants={itemVariants}
                custom={index}
                className="scroll-mt-32"
              >
                <div
                  className={`grid items-center gap-8 md:gap-12 lg:gap-16 md:grid-cols-2 ${
                    isReversed ? "md:[&>div:first-child]:order-2" : ""
                  }`}
                >
                  {/* Text + icon */}
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 rounded-full border border-blue-200/60 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-900/20 px-4 py-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-100">
                        {feature.title}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Future media / demo placeholder */}
                  <motion.div
                    className="relative h-52 md:h-64 lg:h-72 rounded-2xl border border-dashed border-blue-200/70 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/70 via-cyan-50/40 to-transparent dark:from-blue-950/60 dark:via-slate-950/40 dark:to-transparent overflow-hidden flex items-center justify-center"
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {/* Simple animated glow / motion placeholder */}
                    <motion.div
                      className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),transparent_55%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.25),transparent_55%)]"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="relative z-10 flex flex-col items-center gap-2 text-center px-6"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      <span className="text-xs md:text-sm font-medium text-blue-900/80 dark:text-blue-100/90">
                        Coming soon
                      </span>
                      <p className="text-xs md:text-sm text-blue-900/70 dark:text-blue-100/80 max-w-xs">
                        This area will showcase an animated {feature.title.toLowerCase()} demo
                        with real interactions and live previews.
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.section>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
} 