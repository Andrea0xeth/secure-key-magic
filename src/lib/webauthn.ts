import { toast } from "@/components/ui/use-toast";
import * as algosdk from "algosdk";

export interface AuthenticationResult {
  address: string;
  publicKey: string;
}

const STORAGE_KEY = 'algorand_private_key';

// Helper function to get or create Algorand account
const getOrCreateAlgorandAccount = (): algosdk.Account => {
  try {
    // Check if we have a stored private key
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey) {
      console.log("Using existing Algorand account");
      return algosdk.mnemonicToSecretKey(storedKey);
    }

    // If no stored key, generate a new one
    console.log("Generating new Algorand account");
    const account = algosdk.generateAccount();
    // Store the mnemonic (private key) in localStorage
    localStorage.setItem(STORAGE_KEY, algosdk.secretKeyToMnemonic(account.sk));
    return account;
  } catch (error) {
    console.error("Error managing Algorand account:", error);
    throw error;
  }
};

export const registerPasskey = async (): Promise<AuthenticationResult | null> => {
  try {
    // Check if browser supports WebAuthn
    if (!window.PublicKeyCredential) {
      console.error("WebAuthn is not supported in this browser");
      toast({
        title: "Error",
        description: "WebAuthn is not supported in this browser",
        variant: "destructive",
      });
      return null;
    }

    // Check if the device has a platform authenticator
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!available) {
      console.error("No platform authenticator available");
      toast({
        title: "Error",
        description: "Your device doesn't support biometric authentication",
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
      attestation: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        requireResidentKey: true,
        residentKey: "required",
        userVerification: "required",
      },
    };

    console.log("Starting credential creation with options:", createCredentialOptions);

    const credential = await navigator.credentials.create({
      publicKey: createCredentialOptions
    }) as PublicKeyCredential;

    if (!credential) {
      console.error("Failed to create credential");
      throw new Error("Failed to create credential");
    }

    console.log("Credential created successfully:", credential);

    // Get or create Algorand account
    const account = getOrCreateAlgorandAccount();
    console.log("Using Algorand address:", account.addr.toString());

    return {
      address: account.addr.toString(),
      publicKey: algosdk.encodeAddress(account.addr)
    };
  } catch (error) {
    console.error("Error registering passkey:", error);
    toast({
      title: "Registration Failed",
      description: "Failed to register passkey. Please ensure you have biometric authentication enabled.",
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

    // Get existing Algorand account
    const account = getOrCreateAlgorandAccount();
    console.log("Authenticated with Algorand address:", account.addr.toString());

    return {
      address: account.addr.toString(),
      publicKey: algosdk.encodeAddress(account.addr)
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