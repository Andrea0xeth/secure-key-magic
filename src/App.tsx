import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppContent } from "./components/AppContent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative">
          <div className="fixed top-4 right-4 z-[100]">
            <Toaster />
            <Sonner />
          </div>
          <SidebarProvider defaultExpanded={false}>
            <AppContent />
          </SidebarProvider>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;