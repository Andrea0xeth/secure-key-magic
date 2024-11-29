import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

export const AuthForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in successfully");
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate('/');
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }

      if (event === 'USER_UPDATED') {
        console.log("User updated:", session);
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-artence-navy dark:text-white">
          Welcome to Hendrick's Events
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Sign in to access exclusive gin experiences
        </p>
      </div>
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#9b87f5',
                brandAccent: '#7C3AED',
              },
            },
          },
        }}
        providers={[]}
        options={{
          emailRedirectTo: `${window.location.origin}`,
          meta: {
            fields: {
              first_name: {
                type: 'text',
                required: true,
                label: 'First Name',
              },
              last_name: {
                type: 'text',
                required: true,
                label: 'Last Name',
              },
            },
          },
        }}
      />
    </div>
  );
};