import { Link } from "react-router-dom"; // Use react-router-dom
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/services/auth/hook";
// import { MountainIcon } from "lucide-react"; // Example icon for logo
// import { Settings } from "lucide-react"; // Example icon for settings

export function DashboardNavbar() {
  const { user, logout } = useAuth();
  const initials = `${user?.first_name?.[0] ?? "U"}${user?.last_name?.[0] ?? ""}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Brand Title with hover glaze effect */}
        <div className="flex items-center relative group select-none">
          {/* Base text (always visible) */}
          <span className="text-2xl font-extrabold tracking-tight">
            ResuGenie
          </span>
          {/* Gradient overlay for glaze effect */}
          <span
            className="absolute inset-0 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-[length:0%_100%] bg-clip-text text-transparent transition-all duration-700 group-hover:bg-[length:100%_100%]"
            aria-hidden="true"
          >
              ResuGenie
            </span>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex flex-1 justify-center items-center space-x-8 text-sm font-medium">
            <Link
            to="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
            Dashboard
            </Link>
            <Link
            to="/dashboard/resumes"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
            My Resumes
            </Link>
            <Link
            to="/dashboard/account"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
            My Account Data
            </Link>
        </nav>

        {/* Profile Dropdown */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Avatar>
                  <AvatarImage src="" alt="avatar" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
           </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user ? `${user.first_name} ${user.last_name}` : "Guest"}
                  </span>
                  {user?.email && (
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                Settings (coming soon)
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 