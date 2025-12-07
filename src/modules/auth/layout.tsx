import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col transition-all duration-300">
      {/* Header */}
      <header className="py-3 px-4 md:py-4 md:px-6 lg:py-5 lg:px-8 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
        <div className="container flex justify-center items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <span className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent transition-all duration-300">
              ResuGenie
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 md:py-6 md:px-6 lg:py-8 lg:px-8 border-t border-gray-200 dark:border-gray-800 transition-all duration-300">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 lg:gap-6">
            <div className="text-xs md:text-sm text-muted-foreground text-center md:text-left transition-all duration-300">
              © {new Date().getFullYear()} ResuGenie. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 transition-all duration-300">
              <Link 
                to="/terms" 
                className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                Terms
              </Link>
              <Link 
                to="/privacy" 
                className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                Privacy
              </Link>
              <Link 
                to="/contact" 
                className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
