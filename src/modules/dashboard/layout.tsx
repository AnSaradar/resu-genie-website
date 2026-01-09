import { Outlet } from "react-router-dom"; // Import Outlet for rendering child routes
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { useAutoStartTour } from "./hooks/useAutoStartTour";

export default function DashboardLayout() {
  // Auto-start tours based on route
  useAutoStartTour();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <main className="flex-grow container py-8">
        {/* Child routes will be rendered here */}
        <Outlet />
      </main>
      {/* Maybe add a Footer component later */}
      {/* <Footer /> */}
    </div>
  );
} 