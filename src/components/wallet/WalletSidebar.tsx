import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import { Wallet, Settings, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PasskeySection } from "../PasskeySection";
import { useEffect, useState } from "react";
import { authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import type { AuthenticationResult } from "@/lib/webauthn";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export function WalletSidebar() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const storedKey = getStoredAlgorandKey();
    if (storedKey) {
      setAuthResult({
        address: storedKey,
        publicKey: storedKey,
        privateKey: new Uint8Array(),
        addr: storedKey,
        sk: new Uint8Array()
      });
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRegister = async () => {
    const result = await registerPasskey();
    setAuthResult({
      ...result,
      privateKey: new Uint8Array(),
      addr: result.address,
      sk: new Uint8Array()
    });
  };

  const handleAuthenticate = async () => {
    const result = await authenticateWithPasskey();
    setAuthResult(result);
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

  if (!session) {
    return (
      <Sidebar className="border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6 mt-16">
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
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col h-full mt-16">
        <Tabs defaultValue="wallet" className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-between bg-transparent border-b p-0">
              <TabsTrigger 
                value="wallet"
                className="flex-1 py-3 px-4 transition-all duration-200 data-[state=active]:bg-artence-light dark:data-[state=active]:bg-artence-navy data-[state=active]:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Wallet className="h-5 w-5" />
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="flex-1 py-3 px-4 transition-all duration-200 data-[state=active]:bg-artence-light dark:data-[state=active]:bg-artence-navy data-[state=active]:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Settings className="h-5 w-5" />
              </TabsTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="flex-1 py-3 px-4 h-auto rounded-none hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-destructive transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TabsList>
          </div>

          <TabsContent value="wallet" className="p-4 mt-0">
            <PasskeySection
              authResult={authResult}
              onRegister={handleRegister}
              onAuthenticate={handleAuthenticate}
            />
          </TabsContent>

          <TabsContent value="settings" className="p-4 mt-0">
            <div className="text-center text-gray-500">
              User settings coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
  );
}