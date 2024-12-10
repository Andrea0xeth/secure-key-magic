import { useToast } from "@/components/ui/use-toast";
import { Sidebar } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import type { AuthenticationResult } from "@/lib/webauthn";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { SignUpForm } from "../auth/SignUpForm";
import { CloseButton } from "./CloseButton";
import { AuthSection } from "./AuthSection";
import { WalletContent } from "./WalletContent";

export function WalletSidebar() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [session, setSession] = useState<any>(null);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const storedKey = getStoredAlgorandKey();
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
      sk: new Uint8Array(),
      mnemonic: ''
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

  return (
    <Sidebar className="border-l">
      <div className="relative p-6">
        <CloseButton />
        {!session ? (
          <AuthSection showSignUp={showSignUp} setShowSignUp={setShowSignUp} />
        ) : (
          <WalletContent
            authResult={authResult}
            onRegister={handleRegister}
            onAuthenticate={handleAuthenticate}
            onLogout={handleLogout}
          />
        )}
      </div>
    </Sidebar>
  );
}