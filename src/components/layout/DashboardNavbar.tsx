import { Link, useLocation } from "react-router-dom"; // Use react-router-dom
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
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, Coins, ChevronDown } from "lucide-react";
import { useTokenBalance } from "@/services/token/hook";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useAppTranslation } from "@/i18n/hooks";
// import { MountainIcon } from "lucide-react"; // Example icon for logo
// import { Settings } from "lucide-react"; // Example icon for settings

export function DashboardNavbar() {
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();
  const location = useLocation();
  const { data: tokenData, isLoading: isLoadingTokens } = useTokenBalance();
  const { t } = useAppTranslation('dashboard');
  const { t: tCommon } = useAppTranslation('common');
  const initials = `${user?.first_name?.[0] ?? "U"}${user?.last_name?.[0] ?? ""}`;
  
  const tokensRemaining = tokenData?.data?.tokens_remaining ?? 0;
  const totalTokensUsed = tokenData?.data?.total_tokens_used ?? 0;

  // Helper function to determine if a navigation item is active
  const isActive = (path: string) => {
    // For exact match (like /dashboard)
    if (path === location.pathname) return true;
    
    // For nested routes (like /dashboard/resumes should be active when on /dashboard/resumes/123)
    if (location.pathname.startsWith(path) && path !== '/dashboard') return true;
    
    // Special case: /dashboard should only be active when exactly on /dashboard
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    
    return false;
  };

  // Check if any AI feature route is active
  const isAIFeaturesActive = () => {
    return isActive('/dashboard/evaluator') || 
           isActive('/dashboard/cover-letter') || 
           isActive('/dashboard/job-matcher');
  };

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
        <nav className="hidden md:flex flex-1 justify-evenly items-center text-sm font-medium" data-tour-id="navbar-navigation">
            <Link
            to="/dashboard"
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/dashboard') 
                  ? 'text-foreground font-semibold' 
                  : 'text-foreground/60'
              }`}
            >
            {t('navbar.dashboard')}
            </Link>
            
            {/* AI Features Dropdown - Visible on md screens only */}
            <div className="hidden md:flex lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`inline-flex items-center gap-1.5 transition-colors hover:text-foreground/80 focus:outline-none group ${
                    isAIFeaturesActive()
                      ? 'text-foreground font-semibold' 
                      : 'text-foreground/60'
                  }`}
                >
                  {t('navbar.ai_features')}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard/evaluator"
                    className="w-full cursor-pointer flex items-center"
                  >
                    {t('navbar.resume_evaluator')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard/cover-letter"
                    className="w-full cursor-pointer flex items-center"
                  >
                    {t('navbar.cover_letter')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard/job-matcher"
                    className="w-full cursor-pointer flex items-center"
                  >
                    {t('navbar.job_matcher')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>

            {/* AI Features Individual Links - Visible on lg+ screens */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/dashboard/evaluator"
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/dashboard/evaluator') 
                    ? 'text-foreground font-semibold' 
                    : 'text-foreground/60'
                }`}
              >
                {t('navbar.resume_evaluator')}
              </Link>
              <Link
                to="/dashboard/cover-letter"
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/dashboard/cover-letter') 
                    ? 'text-foreground font-semibold' 
                    : 'text-foreground/60'
                }`}
              >
                {t('navbar.cover_letter')}
              </Link>
              <Link
                to="/dashboard/job-matcher"
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/dashboard/job-matcher') 
                    ? 'text-foreground font-semibold' 
                    : 'text-foreground/60'
                }`}
              >
                {t('navbar.job_matcher')}
              </Link>
            </div>

            <Link
            to="/dashboard/resumes"
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/dashboard/resumes') 
                  ? 'text-foreground font-semibold' 
                  : 'text-foreground/60'
              }`}
            >
            {t('navbar.my_resumes')}
            </Link>
            <Link
            to="/dashboard/account"
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/dashboard/account') 
                  ? 'text-foreground font-semibold' 
                  : 'text-foreground/60'
              }`}
            >
            {t('navbar.account')}
            </Link>
        </nav>

        {/* Token Balance, Theme Switcher and Profile Dropdown */}
        <div className="flex items-center gap-4">
          {/* Token Balance Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border" data-tour-id="token-balance">
            <Coins className="h-4 w-4 text-muted-foreground" />
            {isLoadingTokens ? (
              <span className="text-sm text-muted-foreground">{t('navbar.loading')}</span>
            ) : (
              <span className="text-sm font-medium">
                {tokensRemaining.toLocaleString()} {t('navbar.tokens')}
              </span>
            )}
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher variant="dropdown" />

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-9" data-tour-id="theme-switcher">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">{t('navbar.toggle_theme')}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                {tCommon('theme.light')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                {tCommon('theme.dark')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                {tCommon('theme.system')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 relative" data-tour-id="profile-menu">
                <Avatar>
                  <AvatarImage src="" alt="avatar" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user ? `${user.first_name} ${user.last_name}` : t('navbar.guest')}
                  </span>
                  {user?.email && (
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Token Balance Info in Dropdown */}
              {!isLoadingTokens && (
                <>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span>{t('navbar.tokens_remaining')}</span>
                        <span className="font-medium">{tokensRemaining.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t('navbar.total_used')}</span>
                        <span className="font-medium">{totalTokensUsed.toLocaleString()}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem disabled>
                {t('navbar.settings_coming_soon')}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={logout}>{t('navbar.logout')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 