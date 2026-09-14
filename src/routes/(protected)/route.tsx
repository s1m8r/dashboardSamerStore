import { useAuthStore } from "@/stores/userStore";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Toaster } from "sonner";
import SideBar from "@/components/layout/sidebar/sidebar";
import PageTransition from "@/components/layout/pageTransition";
import ThemeToggle from "@/components/layout/themeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createFileRoute("/(protected)")({
  beforeLoad: () => {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: () => (
    <SidebarProvider>
      <TooltipProvider>
        <SideBar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/80 px-3 backdrop-blur-sm">
            <SidebarTrigger />
            <ThemeToggle />
          </header>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
        <Toaster richColors position="top-center" />
      </TooltipProvider>
    </SidebarProvider>
  ),
});
