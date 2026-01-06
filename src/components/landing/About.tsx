import { motion } from "framer-motion";

export function About() {
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

  return (
    <section
      id="about"
      className="py-12 md:py-20 lg:py-24 bg-background relative overflow-hidden scroll-mt-32"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 opacity-50" />

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full bg-blue-200 dark:bg-blue-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20"
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

      <div className="container relative z-10 px-4 md:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="text-center mb-8 md:mb-12"
            variants={itemVariants}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                BitBusters
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="space-y-6 md:space-y-8"
            variants={itemVariants}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 lg:p-10">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                BitBusters is a technology team providing AI and software services for startups and enterprises.
              </p>

              <div className="space-y-4">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  We help organizations design and build AI systems based on LLMs, multi-agent architectures, and automation workflows that improve efficiency, decision-making, and product capabilities. Alongside AI, we develop reliable software systems that support these solutions in real production environments.
                </p>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Our focus is on practical AI, not experiments. We work on clear use cases, measurable outcomes, and systems that teams can actually operate and scale.
                </p>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  BitBusters partners with clients to turn ideas into working systems, from early concept to deployment, with a strong emphasis on simplicity, reliability, and business value.
                </p>
              </div>
            </div>

            {/* Key Points */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
              variants={itemVariants}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Practical AI</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Clear use cases with measurable outcomes
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-cyan-600 dark:text-cyan-400"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Reliability</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Production-ready systems that scale
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      <line x1="12" x2="12" y1="2" y2="22" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Business Value</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  From concept to deployment
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

