import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { authenticateWithPasskey, registerPasskey } from "@/lib/webauthn";
import type { AuthenticationResult } from "@/lib/webauthn";
import { getStoredAlgorandKey } from "@/lib/storage/keyStorage";

export const useWalletAuth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useWalletAuth: Initial mount");
    const initializeWallet = async () => {
      try {
        const storedKey = getStoredAlgorandKey();
        console.log("useWalletAuth: Stored key found:", storedKey);
        
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
        console.log("useWalletAuth: Session loaded:", session);
        setSession(session);
      } catch (error) {
        console.error("useWalletAuth: Error initializing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWallet();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("useWalletAuth: Auth state changed:", _event, session);
      setSession(session);
    });

    return () => {
      console.log("useWalletAuth: Cleanup");
      subscription.unsubscribe();
    };
  }, []);

  const handleRegister = async () => {
    try {
      console.log("useWalletAuth: Starting registration");
      const result = await registerPasskey();
      setAuthResult({
        ...result,
        privateKey: new Uint8Array(),
        addr: result.address,
        sk: new Uint8Array(),
        mnemonic: ''
      });
    } catch (error) {
      console.error("useWalletAuth: Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register passkey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAuthenticate = async () => {
    try {
      console.log("useWalletAuth: Starting authentication");
      const result = await authenticateWithPasskey();
      setAuthResult(result);
    } catch (error) {
      console.error("useWalletAuth: Authentication error:", error);
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

  return {
    authResult,
    session,
    isLoading,
    handleRegister,
    handleAuthenticate,
    handleLogout
  };
};