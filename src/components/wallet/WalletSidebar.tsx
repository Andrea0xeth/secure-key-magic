import { Sidebar } from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { UserProfileSection } from "../UserProfileSection";
import { useEffect, useState } from "react";
import { authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import type { AuthenticationResult } from "@/lib/webauthn";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSidebar } from "@/components/ui/sidebar";
import { WalletTabContent } from "./sidebar/WalletTabContent";
import { TabNavigation } from "./sidebar/TabNavigation";
import { AuthSection } from "./sidebar/AuthSection";
import { LoadingState } from "./sidebar/LoadingState";
import { SidebarHeader } from "./sidebar/SidebarHeader";

export function WalletSidebar() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [session, setSession] = useState<any>(null);
  const { setExpanded } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("WalletSidebar: Initial mount");
    const initializeWallet = async () => {
      try {
        const storedKey = getStoredAlgorandKey();
        console.log("WalletSidebar: Stored key found:", storedKey);
        
        if (storedKey) {
          setAuthResult({
            address: storedKey,
            publicKey: storedKey,
            privateKey: new Uint8Array(),
            addr: storedKey,
            sk: new Uint8Array(),
            mnemonic: ''
          });
        }

        const { data: { session } } = await supabase.auth.getSession();
        console.log("WalletSidebar: Session loaded:", session);
        setSession(session);
      } catch (error) {
        console.error("WalletSidebar: Error initializing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWallet();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("WalletSidebar: Auth state changed:", _event, session);
      setSession(session);
    });

    return () => {
      console.log("WalletSidebar: Cleanup");
      subscription.unsubscribe();
    };
  }, []);

  const handleRegister = async () => {
    try {
      console.log("WalletSidebar: Starting registration");
      const result = await registerPasskey();
      setAuthResult({
        ...result,
        privateKey: new Uint8Array(),
        addr: result.address,
        sk: new Uint8Array(),
        mnemonic: ''
      });
    } catch (error) {
      console.error("WalletSidebar: Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register passkey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAuthenticate = async () => {
    try {
      console.log("WalletSidebar: Starting authentication");
      const result = await authenticateWithPasskey();
      setAuthResult(result);
    } catch (error) {
      console.error("WalletSidebar: Authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with passkey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setAuthResult(null);
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (!session) {
    return (
      <Sidebar className="border-l">
        <AuthSection onClose={() => setExpanded(false)} />
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-l">
      <div className="flex flex-col h-full">
        <SidebarHeader onClose={() => setExpanded(false)} />
        <Tabs defaultValue="wallet" className="w-full mt-16">
          <TabNavigation onLogout={handleLogout} />
          <WalletTabContent
            authResult={authResult}
            onRegister={handleRegister}
            onAuthenticate={handleAuthenticate}
          />
          <TabsContent value="settings" className="p-6 mt-0">
            <UserProfileSection />
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
  );
}