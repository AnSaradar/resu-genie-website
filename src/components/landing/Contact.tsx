import { motion } from "framer-motion";
import { Linkedin, Mail } from "lucide-react";
import anasPhoto from "@/assets/images/Anas Al-Sheikh Bakri.jpg";
import laraPhoto from "@/assets/images/Lara Faroun.jpg";

interface TeamMember {
  name: string;
  title: string;
  photo: string;
  linkedinUrl: string;
  email: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Anas Al-Sheikh Bakri",
    title: "AI Engineer",
    photo: anasPhoto,
    linkedinUrl: "https://www.linkedin.com/in/anas-al-sheikh-bakri/",
    email: "m.anas.alshiekh.bakri@gmail.com",
  },
  {
    name: "Lara Faroun",
    title: "AI Engineer",
    photo: laraPhoto,
    linkedinUrl: "https://www.linkedin.com/in/larafaroun/",
    email: "lara.r.faroun@gmail.com",
  },
];

export function Contact() {
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
      id="contact"
      className="py-12 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden scroll-mt-32"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 dark:from-blue-900/20 dark:to-cyan-900/20" />

      {/* Floating elements */}
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full bg-cyan-200 dark:bg-cyan-900 blur-3xl opacity-10 md:opacity-15 lg:opacity-20"
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
        <motion.div
          className="max-w-5xl mx-auto"
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
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Meet the people behind BitBusters
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
              variants={itemVariants}
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Photo */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900 shadow-md"
                      />
                    </motion.div>

                    {/* Name */}
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                      {member.name}
                    </h3>

                    {/* Title */}
                    <p className="text-base md:text-lg text-muted-foreground">
                      {member.title}
                    </p>

                    {/* Contact Links */}
                    <div className="flex flex-col items-center gap-3 w-full">
                      {/* LinkedIn Link */}
                      <motion.a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Linkedin className="w-5 h-5" />
                        <span className="text-sm md:text-base font-medium">
                          LinkedIn Profile
                        </span>
                      </motion.a>

                      {/* Email Link */}
                      <motion.a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Mail className="w-5 h-5" />
                        <span className="text-sm md:text-base font-medium">
                          {member.email}
                        </span>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Vertical Divider - visible on md and up */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

