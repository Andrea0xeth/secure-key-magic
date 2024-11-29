import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import { WalletSidebar } from "./components/wallet/WalletSidebar";
import "./App.css";

const queryClient = new QueryClient();

function AppContent() {
  return (
    <div className="min-h-screen w-full">
      <Router>
        <div className="flex">
          <div className="flex-1">
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
        <SidebarProvider>
          <AppContent />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;