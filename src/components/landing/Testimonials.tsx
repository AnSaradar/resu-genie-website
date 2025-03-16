import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      avatar: "SJ",
      content:
        "ResuGenie helped me land my dream job! The AI suggestions were spot-on for my industry, and the templates looked so professional. I got more interviews in one month than I had in the previous six.",
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      avatar: "MC",
      content:
        "As a developer, I was skeptical about AI writing my resume, but ResuGenie surprised me. It highlighted my technical skills perfectly and formatted my projects in a way that caught recruiters' attention.",
    },
    {
      name: "Emily Rodriguez",
      role: "Healthcare Professional",
      avatar: "ER",
      content:
        "The ATS optimization feature is a game-changer. Before ResuGenie, my applications weren't even making it past the initial screening. Now I'm getting calls for interviews regularly!",
    },
    {
      name: "David Wilson",
      role: "Finance Analyst",
      avatar: "DW",
      content:
        "Clean, professional templates and excellent content suggestions. ResuGenie helped me quantify my achievements in a way I hadn't thought of before. Worth every penny!",
    },
    {
      name: "Priya Patel",
      role: "UX Designer",
      avatar: "PP",
      content:
        "The real-time editor and instant preview made creating my resume enjoyable rather than stressful. I could see exactly how my design choices affected the final product.",
    },
    {
      name: "James Thompson",
      role: "Sales Director",
      avatar: "JT",
      content:
        "After 15 years in sales, I thought I knew how to sell myself on paper. ResuGenie showed me how to modernize my resume while keeping my experience front and center. Impressive service!",
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
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Users Say
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Thousands of job seekers have used ResuGenie to create standout
            resumes and land their dream jobs.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${testimonial.name}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <svg
                      className="absolute -top-2 -left-2 w-8 h-8 text-blue-100 dark:text-blue-900/50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-base pl-6">{testimonial.content}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 