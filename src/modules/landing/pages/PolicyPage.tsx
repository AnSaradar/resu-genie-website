import { Policy } from "@/components/landing/Policy";
import { TermsOfService } from "@/components/landing/TermsOfService";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function PolicyPage() {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation when component mounts or hash changes
    if (location.hash) {
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
    }
  }, [location.hash]);

  return (
    <>
      <Policy />
      <TermsOfService />
    </>
  );
}

