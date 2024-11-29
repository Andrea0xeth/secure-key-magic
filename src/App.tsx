import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Index from "./pages/Index";
import { WalletSidebar } from "./components/wallet/WalletSidebar";
import "./App.css";

const queryClient = new QueryClient();

function AppContent() {
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen w-full">
      <Router>
        <div className="flex justify-end">
          <div 
            className={cn(
              "min-h-screen w-full transition-all duration-500 ease-in-out",
              expanded ? "md:mr-[500px]" : "mr-0"
            )}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<Index />} />
            </Routes>
          </div>
          <WalletSidebar />
        </div>
      </Router>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider defaultExpanded={false}>
          <AppContent />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;