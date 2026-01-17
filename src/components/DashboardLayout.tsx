import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { PageTransition } from "@/components/ui/PageTransition";
import { AuroraBackground } from "@/components/ui/aurora-background";

export function DashboardLayout() {
  return (
    <AuroraBackground className="h-screen w-full" showRadialGradient={false}>
      <div className="flex h-full w-full overflow-hidden relative">
        {/* Sidebar */}
        <div className="relative z-10 h-full flex-shrink-0">
          <AppSidebar />
        </div>

        <main className="flex-1 overflow-auto relative z-10 w-full">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </AuroraBackground>
  );
}
