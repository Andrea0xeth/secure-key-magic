import { toast } from "@/components/ui/use-toast";
import * as algosdk from "algosdk";

export interface AuthenticationResult {
  address: string;
  publicKey: string;
}

// Helper function to generate Algorand address from public key
const generateAlgorandAddress = (publicKeyBytes: Uint8Array): string => {
  try {
    const account = algosdk.generateAccount();
    // In a real implementation, you would derive the address from the WebAuthn public key
    // This is just a demo that returns a valid Algorand address
    return account.addr;
  } catch (error) {
    console.error("Error generating Algorand address:", error);
    throw error;
  }
};

export const registerPasskey = async (): Promise<AuthenticationResult | null> => {
  try {
    if (!window.PublicKeyCredential) {
      toast({
        title: "Error",
        description: "WebAuthn is not supported in this browser",
        variant: "destructive",
      });
      return null;
    }

    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const createCredentialOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Algorand Passkeys Demo",
        id: window.location.hostname,
      },
      user: {
        id: Uint8Array.from("DEMO_USER_ID", c => c.charCodeAt(0)),
        name: "demo@example.com",
        displayName: "Demo User",
      },
      pubKeyCredParams: [{
        type: "public-key",
        alg: -7 // ES256
      }],
      timeout: 60000,
      attestation: "direct",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
      },
    };

    const credential = await navigator.credentials.create({
      publicKey: createCredentialOptions
    }) as PublicKeyCredential;

    // Generate a demo Algorand address
    const demoAccount = algosdk.generateAccount();
    console.log("Generated Algorand address:", demoAccount.addr);

    return {
      address: demoAccount.addr,
      publicKey: "demo_public_key"
    };
  } catch (error) {
    console.error("Error registering passkey:", error);
    toast({
      title: "Registration Failed",
      description: "Failed to register passkey. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const authenticateWithPasskey = async (): Promise<AuthenticationResult | null> => {
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const getCredentialOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: "required",
      rpId: window.location.hostname,
    };

    const assertion = await navigator.credentials.get({
      publicKey: getCredentialOptions
    });

    // Generate a demo Algorand address
    const demoAccount = algosdk.generateAccount();
    console.log("Authenticated with Algorand address:", demoAccount.addr);

    return {
      address: demoAccount.addr,
      publicKey: "demo_public_key"
    };
  } catch (error) {
    console.error("Error authenticating with passkey:", error);
    toast({
      title: "Authentication Failed",
      description: "Failed to authenticate with passkey. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};