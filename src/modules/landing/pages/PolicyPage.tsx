import { Policy } from "@/components/landing/Policy";
import { TermsOfService } from "@/components/landing/TermsOfService";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function PolicyPage() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when page loads (no hash)
    if (!location.hash) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    // Handle hash navigation when component mounts or hash changes
    const element = document.querySelector(location.hash);
    if (element) {
      const headerOffset = 80; // Account for sticky navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Small delay to ensure the page has rendered
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [location.hash, location.pathname]);

  return (
    <>
      <Policy />
      <TermsOfService />
    </>
  );
}

