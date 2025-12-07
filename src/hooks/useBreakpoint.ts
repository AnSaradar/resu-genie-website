import { useState, useEffect } from "react";

interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  width: number;
}

/**
 * useBreakpoint - Custom hook to detect current breakpoint
 * Returns boolean values for each breakpoint and current width
 * 
 * Breakpoints:
 * - Mobile: < 640px
 * - Tablet: 640px - 1023px
 * - Laptop: 1024px - 1279px
 * - Desktop: >= 1280px
 * 
 * @example
 * const { isMobile, isTablet, isLaptop } = useBreakpoint();
 * if (isMobile) {
 *   // Mobile-specific logic
 * }
 */
export function useBreakpoint(): BreakpointState {
  const [breakpoint, setBreakpoint] = useState<BreakpointState>({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setBreakpoint({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isLaptop: width >= 1024 && width < 1280,
        isDesktop: width >= 1280,
        width,
      });
    };

    // Set initial breakpoint
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}

