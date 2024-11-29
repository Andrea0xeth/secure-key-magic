import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthForm = () => {
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
      />
    </div>
  );
};