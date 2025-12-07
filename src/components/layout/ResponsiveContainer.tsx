import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * ResponsiveContainer - A reusable container component with consistent padding and max-widths
 * Supports mobile, tablet, and laptop breakpoints with smooth transitions
 * 
 * @example
 * <ResponsiveContainer maxWidth="md" padding="lg">
 *   <YourContent />
 * </ResponsiveContainer>
 */
export function ResponsiveContainer({
  children,
  className,
  maxWidth = "full",
  padding = "md",
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-4 py-6 md:px-6 md:py-8",
    md: "px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16",
    lg: "px-4 md:px-6 lg:px-8 xl:px-10 py-12 md:py-16 lg:py-20",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto transition-all duration-300",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

