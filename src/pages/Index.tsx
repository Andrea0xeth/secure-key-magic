import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/AuthForm";
import { EventsList } from "@/components/events/EventsList";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { UserHeader } from "@/components/layout/UserHeader";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-artence-navy dark:to-gray-900 transition-colors duration-300">
      {session && <UserHeader />}
      <div className="w-full px-2 pt-16 pb-8 animate-fade-in">
        {!session ? (
          <Card className="max-w-md mx-auto p-6 shadow-lg border-2 border-opacity-50 backdrop-blur-sm bg-white/90 dark:bg-artence-navy/90 dark:border-gray-700 transition-colors duration-300">
            <AuthForm />
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-artence-navy dark:text-white mb-4">
                Hendrick's Gin Events
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover our peculiar gatherings and collect unique NFTs from each extraordinary experience
              </p>
            </div>
            <EventsList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;