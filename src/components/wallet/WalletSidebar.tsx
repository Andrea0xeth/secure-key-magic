import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import { Wallet, Settings, LogOut, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PasskeySection } from "../PasskeySection";
import { UserProfileSection } from "../UserProfileSection";
import { useEffect, useState } from "react";
import { authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import type { AuthenticationResult } from "@/lib/webauthn";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSidebar } from "@/components/ui/sidebar";

export function WalletSidebar() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [session, setSession] = useState<any>(null);
  const { setExpanded } = useSidebar();

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
      <Sidebar className="border-l">
        <div className="relative p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(false)}
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
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-l">
      <div className="flex flex-col h-full">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(false)}
            className="absolute right-4 top-4 rotate-animation"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Tabs defaultValue="wallet" className="w-full mt-16">
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

          <TabsContent value="wallet" className="p-6 mt-0">
            <div className="mb-8 space-y-4">
              <h2 className="text-2xl font-semibold text-artence-navy dark:text-white">
                Your Digital Wallet
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Create a secure and easy-to-use wallet with passkeys - the modern way to manage your digital assets. Passkeys use your device's biometric security (like Face ID or fingerprint) to keep your wallet safe without the need for complex passwords.
              </p>
              <div className="bg-artence-light dark:bg-artence-navy/50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  ✨ With passkeys, you can:
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Access your wallet securely across all your devices</li>
                  <li>• Sign transactions with just your fingerprint or Face ID</li>
                  <li>• Never worry about losing or forgetting complex passwords</li>
                </ul>
              </div>
            </div>
            <PasskeySection
              authResult={authResult}
              onRegister={handleRegister}
              onAuthenticate={handleAuthenticate}
            />
          </TabsContent>

          <TabsContent value="settings" className="p-6 mt-0">
            <UserProfileSection />
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
  );
}