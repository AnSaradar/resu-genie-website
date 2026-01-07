import { motion } from "framer-motion";

export function Policy() {
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
      id="policy"
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
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
              Privacy{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Policy
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
                {/* Section 1: Who We Are */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    1. Who We Are
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>
                      ResuGenie is operated by BitBusters Team, an individual team based in Damascus, Syria.
                    </p>
                    <p>
                      ResuGenie provides AI-assisted resume generation, job matching, and candidate shortlisting services.
                    </p>
                    <p>
                      This service is not operated by a registered company.
                    </p>
                  </div>
                </motion.div>

                {/* Section 2: Information We Collect */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    2. Information We Collect
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>
                      We collect and store the following personal data provided by users:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Full name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Resume and CV content, including work history, education, skills</li>
                      <li>Portfolio links, GitHub, and external profiles</li>
                      <li>Job preferences and career interests</li>
                      <li>IP address, device information, and usage data</li>
                    </ul>
                    <p>
                      We do not collect or store payment information.
                    </p>
                  </div>
                </motion.div>

                {/* Section 3: How We Use Your Information */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    3. How We Use Your Information
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>We use user data for the following purposes:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Generating resumes, cover letters, and job-related documents</li>
                      <li>Producing AI-generated candidate shortlists</li>
                      <li>Improving and fine-tuning our AI systems</li>
                      <li>Analyzing platform usage and performance</li>
                      <li>Sharing candidate data with hiring companies</li>
                    </ul>
                  </div>
                </motion.div>

                {/* Section 4: Sharing and Selling User Data */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    4. Sharing and Selling User Data
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>By using ResuGenie, you acknowledge and accept that:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Your data may be shared with hiring companies in the form of candidate shortlists</li>
                      <li>Your data may be sold or shared with third parties for recruitment or hiring-related purposes</li>
                      <li>Users do not have an opt-in or opt-out mechanism for this sharing</li>
                      <li>This data may include resume content and associated professional information.</li>
                    </ul>
                  </div>
                </motion.div>

                {/* Section 5: AI Models and Data Usage */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    5. AI Models and Data Usage
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>ResuGenie uses third-party AI providers as well as internally fine-tuned AI systems.</li>
                      <li>User data may be used to improve internal AI models</li>
                      <li>Data used for AI improvement is anonymized</li>
                      <li>Users currently cannot opt out of their data being used for AI model enhancement</li>
                      <li>We do not guarantee that anonymization is irreversible in all cases.</li>
                    </ul>
                  </div>
                </motion.div>

                {/* Section 6: Data Retention and Deletion */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    6. Data Retention and Deletion
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Users may request account deletion</li>
                      <li>Deletion is permanent and irreversible</li>
                      <li>No backups of deleted data are retained</li>
                      <li>Once deleted, all associated data is removed from our systems.</li>
                    </ul>
                  </div>
                </motion.div>

                {/* Section 7: User Age */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    7. User Age
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    There is no minimum age requirement to use ResuGenie.
                  </p>
                </motion.div>

                {/* Section 8: Data Security */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    8. Data Security
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>
                      We take reasonable technical measures to protect user data.
                    </p>
                    <p>
                      However, no system is fully secure, and we do not guarantee absolute data protection.
                    </p>
                  </div>
                </motion.div>

                {/* Section 9: Jurisdiction */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    9. Jurisdiction
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>
                      This service is governed by the laws applicable in Syria.
                    </p>
                    <p>
                      ResuGenie does not claim compliance with GDPR or other international privacy regulations.
                    </p>
                  </div>
                </motion.div>

                {/* Section 10: Changes to This Policy */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
                    10. Changes to This Policy
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p>
                      We may update this Privacy Policy at any time.
                    </p>
                    <p>
                      Continued use of the service constitutes acceptance of the updated policy.
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

