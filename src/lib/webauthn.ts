import { toast } from "@/hooks/use-toast";
import * as algosdk from "algosdk";
import { connectWithWalletConnect } from "./walletConnect";
import { deriveAlgorandSeedFromCredential } from "./crypto/seedDerivation";
import { storeAlgorandKey, getStoredAlgorandKey } from "./storage/keyStorage";

export interface AuthenticationResult {
  address: string;
  publicKey: string;
}

const getOrCreateAlgorandAccount = async (credential?: PublicKeyCredential): Promise<algosdk.Account> => {
  try {
    const storedKey = getStoredAlgorandKey();
    if (storedKey) {
      console.log("Using existing Algorand account");
      return algosdk.mnemonicToSecretKey(storedKey);
    }

    if (credential) {
      console.log("Deriving new Algorand account from passkey");
      const seed = await deriveAlgorandSeedFromCredential(credential);
      storeAlgorandKey(seed);
      return algosdk.mnemonicToSecretKey(seed);
    }

    console.log("Generating new Algorand account");
    const account = algosdk.generateAccount();
    storeAlgorandKey(algosdk.secretKeyToMnemonic(account.sk));
    return account;
  } catch (error) {
    console.error("Error managing Algorand account:", error);
    throw error;
  }
};

export const authenticateWithPasskey = async (): Promise<AuthenticationResult | null> => {
  try {
    console.log("Starting passkey authentication...");
    
    if (!window.PublicKeyCredential) {
      console.error("WebAuthn is not supported in this browser");
      throw new Error("WebAuthn is not supported in this browser");
    }

    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const getCredentialOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: "required",
      rpId: window.location.hostname,
    };

    console.log("Requesting credential with options:", getCredentialOptions);

    const assertion = await navigator.credentials.get({
      publicKey: getCredentialOptions
    }) as PublicKeyCredential;

    if (!assertion) {
      console.error("No assertion returned from credentials.get()");
      throw new Error("Authentication failed - no credential returned");
    }

    console.log("Credential assertion received:", assertion);

    const account = await getOrCreateAlgorandAccount(assertion);
    console.log("Authenticated with Algorand address:", account.addr);

    return {
      address: algosdk.encodeAddress(account.addr.publicKey),
      publicKey: algosdk.encodeAddress(account.addr.publicKey)
    };
  } catch (error) {
    console.error("Error authenticating with passkey:", error);
    throw error;
  }
};

export const registerPasskey = async (): Promise<AuthenticationResult | null> => {
  try {
    if (!window.PublicKeyCredential) {
      console.error("WebAuthn is not supported in this browser");
      toast({
        title: "Error",
        description: "WebAuthn is not supported in this browser",
        variant: "destructive",
      });
      return null;
    }

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

    const userId = new Uint8Array(16);
    crypto.getRandomValues(userId);

    const createCredentialOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Algorand Passkeys Demo",
        id: window.location.hostname,
      },
      user: {
        id: userId,
        name: `user-${Array.from(userId).map(b => b.toString(16).padStart(2, '0')).join('')}`,
        displayName: "Algorand User",
      },
      pubKeyCredParams: [{
        type: "public-key",
        alg: -7
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

    const account = await getOrCreateAlgorandAccount(credential);
    console.log("Using Algorand address:", account.addr);

    return {
      address: algosdk.encodeAddress(account.addr.publicKey),
      publicKey: algosdk.encodeAddress(account.addr.publicKey)
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

export const exportPrivateKey = async (): Promise<string | null> => {
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
    }) as PublicKeyCredential;

    if (!assertion) {
      toast({
        title: "Verification Failed",
        description: "Passkey verification is required to export the private key",
        variant: "destructive",
      });
      return null;
    }

    const storedKey = getStoredAlgorandKey();
    if (!storedKey) {
      throw new Error("No private key found");
    }
    return storedKey;
  } catch (error) {
    console.error("Error exporting private key:", error);
    toast({
      title: "Export Failed",
      description: "Failed to verify passkey or export private key",
      variant: "destructive",
    });
    return null;
  }
};

export const processWalletConnectUrl = async (wcUrl: string, address: string): Promise<boolean> => {
  try {
    const success = await connectWithWalletConnect(wcUrl, address);
    
    if (success) {
      toast({
        title: "Connection Status",
        description: "Connected with address: " + address,
      });
    }
    
    return success;
  } catch (error) {
    console.error("Error processing WalletConnect URL:", error);
    toast({
      title: "Connection Failed",
      description: "Failed to process WalletConnect URL: " + (error as Error).message,
      variant: "destructive",
    });
    return false;
  }
};
