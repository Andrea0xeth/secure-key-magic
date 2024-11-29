import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export const AppHeader = () => {
  const { expanded, setExpanded } = useSidebar();
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginClick = () => {
    setExpanded(true);
    navigate('/auth');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/5 dark:bg-black/20 backdrop-blur-md border-b border-gray-200/10 dark:border-gray-800/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/artence-logo-white.svg" 
            alt="Artence Logo" 
            className="h-8 w-auto hidden dark:block"
          />
          <img 
            src="/artence-logo-black.svg" 
            alt="Artence Logo" 
            className="h-8 w-auto dark:hidden"
          />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-artence-green to-primary">
            Hendrick's Gin Events
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {!session && (
            <Button 
              onClick={handleLoginClick}
              className="bg-artence-green hover:bg-artence-green/90 text-white transition-colors duration-300"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="transition-all duration-300 hover:bg-white/10 dark:hover:bg-black/20"
          >
            <ChevronRight 
              className={`h-6 w-6 text-gray-200 transition-all duration-300 ease-in-out transform ${expanded ? 'rotate-180' : ''}`} 
            />
          </Button>
        </div>
      </div>
    </header>
  );
};