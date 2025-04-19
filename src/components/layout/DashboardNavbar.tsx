import { Link } from "react-router-dom"; // Use react-router-dom
import { Button } from "@/components/ui/button";
// import { MountainIcon } from "lucide-react"; // Example icon for logo
// import { Settings } from "lucide-react"; // Example icon for settings

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          {/* Logo/Brand Name */}
          <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
            {/* <MountainIcon className="h-6 w-6" /> */}
            <span className="font-bold">
              ResuGenie
            </span>
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/dashboard/templates" // Use 'to' prop
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Templates
            </Link>
            <Link
              to="/dashboard/documents"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Documents
            </Link>
            <Link
              to="/dashboard/checker"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Resume Checker
            </Link>
            <Link
              to="/dashboard/ai-features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              AI Features
            </Link>
          </nav>
        </div>

        {/* Right side: User Menu/Actions (Add mobile toggle later) */}
        <div className="flex flex-1 items-center justify-end space-x-4">
           {/* Placeholder for User Profile/Settings Button */}
           <Button variant="ghost" size="icon" title="User Settings">
             {/* <Settings className="h-5 w-5" /> */}
             <span className="text-xs">User</span> {/* Temporary text */}
           </Button>
        </div>
      </div>
    </header>
  );
} 