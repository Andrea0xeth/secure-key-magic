import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PasskeySection } from "../PasskeySection";
import { useEffect, useState } from "react";
import { authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import type { AuthenticationResult } from "@/lib/webauthn";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";

export function WalletSidebar() {
  const { expanded } = useSidebar();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);

  useEffect(() => {
    const storedKey = getStoredAlgorandKey();
    if (storedKey) {
      setAuthResult({ address: storedKey });
    }
  }, []);

  const handleRegister = async () => {
    const result = await registerPasskey();
    setAuthResult(result);
    return result;
  };

  const handleAuthenticate = async () => {
    const result = await authenticateWithPasskey();
    setAuthResult(result);
    return result;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 
      ${expanded ? 'w-80' : 'w-20'} transition-all duration-300 p-4 flex flex-col justify-between`}
    >
      <div>
        <PasskeySection
          authResult={authResult}
          onRegister={handleRegister}
          onAuthenticate={handleAuthenticate}
        />
      </div>
      
      <div className="mt-auto">
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {expanded ? 'Logout' : ''}
        </Button>
      </div>
    </div>
  );
}