import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";

export const AppHeader = () => {
  const { expanded, setExpanded } = useSidebar();
  const [session, setSession] = useState<any>(null);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-artence-navy/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-artence-purple to-primary">
          Artence Passkey
        </h1>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {session ? (
            <ChevronRight 
              className={`h-6 w-6 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out transform ${expanded ? 'rotate-180' : ''}`} 
            />
          ) : (
            <LogIn className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          )}
        </Button>
      </div>
    </header>
  );
};