import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Index from "./pages/Index";
import MyNFTs from "./pages/MyNFTs";
import { WalletSidebar } from "./components/wallet/WalletSidebar";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { expanded } = useSidebar();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear any auth related storage
        queryClient.clear();
        localStorage.removeItem('supabase.auth.token');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen w-full">
      <div className="flex justify-end">
        <div 
          className={cn(
            "min-h-screen w-full will-change-transform",
            "transition-all duration-500 ease-in-out",
            expanded ? "md:mr-[500px]" : "mr-0"
          )}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/my-nfts" element={<MyNFTs />} />
            <Route path="*" element={<Index />} />
          </Routes>
        </div>
        <WalletSidebar />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Toaster />
          <Sonner />
          <SidebarProvider defaultExpanded={false}>
            <AppContent />
          </SidebarProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;