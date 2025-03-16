import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Templates } from "@/components/landing/Templates";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";

export function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Templates />
      <Testimonials />
      <CTA />
    </>
  );
} 