import { AppSidebar } from "@/src/widgets/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/src/entities/sidebar";
import { DashboardHeader, DashboardContent } from "@/src/feature";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <DashboardHeader />

        <DashboardContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
