import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import { WalletSidebar } from "./components/wallet/WalletSidebar";
import { Button } from "@/components/ui/button";
import { Expand, Collapse } from "lucide-react";
import "./App.css";

const queryClient = new QueryClient();

function AppContent() {
  const { expanded, setExpanded } = useSidebar();
  
  return (
    <div className="min-h-screen flex w-full">
      <Router>
        <div className="flex-1">
          <div className="fixed top-4 right-4 z-50">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setExpanded(!expanded)}
            >
              <div className="transition-transform duration-200">
                {expanded ? (
                  <Collapse className="h-4 w-4" />
                ) : (
                  <Expand className="h-4 w-4" />
                )}
              </div>
            </Button>
          </div>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<Index />} />
          </Routes>
        </div>
        <WalletSidebar />
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
        <SidebarProvider>
          <AppContent />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;