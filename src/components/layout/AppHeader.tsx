import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
    <header className="fixed top-0 left-0 right-0 z-[100] bg-hendricks-dark/80 backdrop-blur-sm border-b border-hendricks-gold/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-serif text-hendricks-cream">
          Hendrick's Events
        </h1>
        
        <div className="flex gap-2 items-center">
          {!session && (
            <Button 
              onClick={handleLoginClick}
              className="bg-hendricks-green hover:bg-hendricks-green/90 text-hendricks-cream font-serif transition-colors duration-300 border border-hendricks-gold/20"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="transition-all duration-300 hover:bg-hendricks-purple/10 text-hendricks-cream"
          >
            <ChevronRight 
              className={cn(
                "h-6 w-6 transition-all duration-300 ease-in-out transform",
                expanded ? 'rotate-180' : ''
              )} 
            />
          </Button>
        </div>
      </div>
    </header>
  );
};