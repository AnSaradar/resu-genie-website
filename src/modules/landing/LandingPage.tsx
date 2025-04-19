import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Templates } from "@/components/landing/Templates";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  // Function to handle navigation to login page
  const handleLoginClick = () => {
    navigate("/login");
  };

  // Function to handle navigation to register page
  const handleRegisterClick = () => {
    navigate("/register");
  };

  // Pass these functions to the components that need them
  // For example, you might have login/register buttons in Hero or CTA components

  return (
    <>
      <Hero onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <Features />
      <Templates />
      <Testimonials />
      <CTA onRegisterClick={handleRegisterClick} />
    </>
  );
} 