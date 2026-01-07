import { motion } from "framer-motion";

export function TermsOfService() {
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

  return (
    <section
      id="terms"
      className="py-12 md:py-20 lg:py-24 bg-background relative overflow-hidden scroll-mt-32"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 opacity-50" />

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full bg-purple-200 dark:bg-purple-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20"
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
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
              Terms of{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Service
              </span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Last updated: Jan-2026
            </p>
          </motion.div>

          <motion.div
            className="space-y-6 md:space-y-8"
            variants={itemVariants}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 lg:p-10">
              <div className="space-y-8">
                {/* Section 1: Acceptance of Terms */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    1. Acceptance of Terms
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>
                      By accessing or using ResuGenie, you agree to these Terms of Service in full.
                    </p>
                    <p>
                      If you do not agree, do not use the service.
                    </p>
                  </div>
                </motion.div>

                {/* Section 2: Description of Service */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    2. Description of Service
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>ResuGenie provides AI-powered tools for:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Resume and cover letter generation</li>
                      <li>Job matching</li>
                      <li>Candidate analysis and shortlisting</li>
                    </ul>
                    <p>
                      The service is informational and assistive in nature.
                    </p>
                  </div>
                </motion.div>

                {/* Section 3: No Guarantees */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    3. No Guarantees
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>ResuGenie makes no guarantees regarding:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Employment outcomes</li>
                      <li>Interview success</li>
                      <li>Hiring decisions</li>
                    </ul>
                    <p>
                      Hiring decisions are made solely by third-party employers.
                    </p>
                  </div>
                </motion.div>

                {/* Section 4: User Responsibilities */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    4. User Responsibilities
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>You confirm that:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>All information you provide is accurate and truthful</li>
                      <li>You have the right to share all content you upload</li>
                      <li>You understand your data may be shared or sold as described in the Privacy Policy</li>
                    </ul>
                  </div>
                </motion.div>

                {/* Section 5: Use of User Content */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    5. Use of User Content
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>By submitting content to ResuGenie, you grant us the right to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Process, analyze, modify, and generate derivative content</li>
                      <li>Use anonymized data for AI improvement</li>
                      <li>Share or sell content for hiring-related purposes</li>
                    </ul>
                    <p>
                      This license is worldwide and royalty-free.
                    </p>
                  </div>
                </motion.div>

                {/* Section 6: Account Termination */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    6. Account Termination
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>
                      We reserve the right to suspend or terminate accounts at any time, with or without notice.
                    </p>
                    <p>
                      Users may also delete their accounts permanently.
                    </p>
                  </div>
                </motion.div>

                {/* Section 7: Limitation of Liability */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    7. Limitation of Liability
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>To the maximum extent permitted by law:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>ResuGenie is not liable for hiring decisions</li>
                      <li>ResuGenie is not liable for data misuse by third parties</li>
                      <li>ResuGenie is not responsible for lost opportunities or damages</li>
                    </ul>
                    <p>
                      Use of the service is at your own risk.
                    </p>
                  </div>
                </motion.div>

                {/* Section 8: Service Availability */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    8. Service Availability
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>
                      We do not guarantee uninterrupted or error-free operation.
                    </p>
                    <p>
                      Features may change or be removed without notice.
                    </p>
                  </div>
                </motion.div>

                {/* Section 9: Governing Law */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    9. Governing Law
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    These terms are governed by applicable laws in Syria.
                  </p>
                </motion.div>

                {/* Section 10: Contact */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    10. Contact
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>For questions or concerns, contact:</p>
                    <p>
                      <a
                        href="mailto:teambitbusters@gmail.com"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        teambitbusters@gmail.com
                      </a>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

