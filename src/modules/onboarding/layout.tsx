import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export default function OnboardingLayout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <Outlet />
    </motion.div>
  );
} 