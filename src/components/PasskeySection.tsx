import { useState, useEffect } from "react";
import { AuthenticationResult } from "@/lib/webauthn";
import { getStoredAlgorandKey, clearStoredAlgorandKey } from "@/lib/storage/keyStorage";
import { supabase } from "@/integrations/supabase/client";
import { WalletInfo } from "./wallet/WalletInfo";
import { AuthButtons } from "./wallet/AuthButtons";

interface PasskeySectionProps {
  authResult: AuthenticationResult | null;
  onRegister: () => Promise<void>;
  onAuthenticate: () => Promise<void>;
}

export const PasskeySection = ({ authResult, onRegister, onAuthenticate }: PasskeySectionProps) => {
  const [currentTransaction, setCurrentTransaction] = useState<{
    txn: string;
    type?: string;
  } | null>(null);

  // Only check stored key if we have an auth result
  const storedKey = authResult ? getStoredAlgorandKey() : null;

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing passkey data");
        clearStoredAlgorandKey();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  if (authResult && storedKey) {
    return <WalletInfo address={storedKey} />;
  }
  
  return (
    <AuthButtons 
      onRegister={onRegister}
      onAuthenticate={onAuthenticate}
    />
  );
};