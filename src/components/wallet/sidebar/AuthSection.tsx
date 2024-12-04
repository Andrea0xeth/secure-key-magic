import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AuthSectionProps {
  onClose: () => void;
}

export const AuthSection = ({ onClose }: AuthSectionProps) => {
  return (
    <div className="relative p-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-4 rotate-animation"
      >
        <X className="h-5 w-5" />
      </Button>
      <div className="mt-16">
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
    </div>
  );
};