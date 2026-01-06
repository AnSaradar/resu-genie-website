import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/services/auth/hook";

export function Navbar() {
  const { setTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80; // Account for sticky navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="group relative">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent relative z-10 transition-all duration-300">
              ResuGenie
            </span>
            {/* Glazing glow effect */}
            <span 
              className="absolute inset-0 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-0"
              aria-hidden="true"
            >
              ResuGenie
            </span>
            <span 
              className="absolute inset-0 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-0"
              aria-hidden="true"
            >
              ResuGenie
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <motion.a
            href="#cover-letter"
            onClick={(e) => handleSmoothScroll(e, "cover-letter")}
            className="text-sm font-medium hover:text-primary cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cover Letter
          </motion.a>
          <motion.a
            href="#job-matcher"
            onClick={(e) => handleSmoothScroll(e, "job-matcher")}
            className="text-sm font-medium hover:text-primary cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Job Matcher
          </motion.a>
          <motion.a
            href="#resume-evaluator"
            onClick={(e) => handleSmoothScroll(e, "resume-evaluator")}
            className="text-sm font-medium hover:text-primary cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Resume Evaluator
          </motion.a>
          <motion.a
            href="#templates"
            onClick={(e) => handleSmoothScroll(e, "templates")}
            className="text-sm font-medium hover:text-primary cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ATS-Templates
          </motion.a>
          {isAuthenticated && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium hover:text-primary ${
                  location.pathname.startsWith('/dashboard') 
                    ? 'text-primary font-semibold' 
                    : ''
                }`}
              >
                Dashboard
              </Link>
            </motion.div>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-9">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${isMenuOpen ? "hidden" : "block"}`}
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${isMenuOpen ? "block" : "hidden"}`}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container py-4 space-y-4">
          <a
            href="#cover-letter"
            onClick={(e) => handleSmoothScroll(e, "cover-letter")}
            className="block text-sm font-medium cursor-pointer"
          >
            Cover Letter
          </a>
          <a
            href="#job-matcher"
            onClick={(e) => handleSmoothScroll(e, "job-matcher")}
            className="block text-sm font-medium cursor-pointer"
          >
            Job Matcher
          </a>
          <a
            href="#resume-evaluator"
            onClick={(e) => handleSmoothScroll(e, "resume-evaluator")}
            className="block text-sm font-medium cursor-pointer"
          >
            Resume Evaluator
          </a>
          <a
            href="#templates"
            onClick={(e) => handleSmoothScroll(e, "templates")}
            className="block text-sm font-medium cursor-pointer"
          >
            ATS-Templates
          </a>
          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className={`block text-sm font-medium ${
                location.pathname.startsWith('/dashboard') 
                  ? 'text-primary font-semibold' 
                  : ''
              }`}
            >
              Dashboard
            </Link>
          )}
          <div className="flex flex-col gap-2 pt-4 border-t">
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
} 