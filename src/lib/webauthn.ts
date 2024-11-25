import { toast } from "@/hooks/use-toast";
import * as algosdk from "algosdk";
import { Web3Modal } from '@web3modal/standalone';
import { SignClient } from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';

const STORAGE_KEY = 'algorand_private_key';

// Initialize Web3Modal with project ID and required configuration
const web3Modal = new Web3Modal({
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
  walletConnectVersion: 2,
  standaloneChains: ['algorand']
});

// Helper function to get or create Algorand account
const getOrCreateAlgorandAccount = (): algosdk.Account => {
  try {
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey) {
      console.log("Using existing Algorand account");
      return algosdk.mnemonicToSecretKey(storedKey);
    }

    console.log("Generating new Algorand account");
    const account = algosdk.generateAccount();
    localStorage.setItem(STORAGE_KEY, algosdk.secretKeyToMnemonic(account.sk));
    return account;
  } catch (error) {
    console.error("Error managing Algorand account:", error);
    throw error;
  }
};

let signClient: typeof SignClient | null = null;

async function initSignClient() {
  if (!signClient) {
    signClient = await SignClient.init({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      metadata: {
        name: 'Algorand Passkeys',
        description: 'Secure Algorand authentication using passkeys',
        url: window.location.host,
        icons: ['https://walletconnect.com/walletconnect-logo.png']
      }
    });
  }
  return signClient;
}

export interface AuthenticationResult {
  address: string;
  publicKey: string;
}

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

    const account = getOrCreateAlgorandAccount();
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

    const account = getOrCreateAlgorandAccount();
    console.log("Authenticated with Algorand address:", account.addr);

    return {
      address: algosdk.encodeAddress(account.addr.publicKey),
      publicKey: algosdk.encodeAddress(account.addr.publicKey)
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

export const processWalletConnectUrl = async (wcUrl: string, address: string): Promise<boolean> => {
  try {
    console.log("Processing WalletConnect URL:", wcUrl);
    console.log("Using Algorand address:", address);
    
    if (!wcUrl.startsWith('wc:')) {
      console.error("Invalid WalletConnect URL format");
      toast({
        title: "Error",
        description: "Invalid WalletConnect URL format. Must start with 'wc:'",
        variant: "destructive",
      });
      return false;
    }

    const client = await initSignClient();
    
    // Parse the URI
    const { uri, approval } = await client.connect({
      pairingTopic: wcUrl,
      requiredNamespaces: {
        algorand: {
          methods: [
            'algorand_signTransaction',
            'algorand_signTxnGroup',
          ],
          chains: ['algorand:mainnet'],
          events: ['accountsChanged']
        }
      }
    });

    console.log("Pairing with dApp...");
    
    // Approve the session with our address
    const session = await approval();
    console.log("Session established:", session);

    // Update the session with our address
    await client.update({
      topic: session.topic,
      namespaces: {
        algorand: {
          accounts: [`algorand:mainnet:${address}`],
          methods: [
            'algorand_signTransaction',
            'algorand_signTxnGroup',
          ],
          events: ['accountsChanged']
        }
      }
    });

    console.log("Session updated with address:", address);
    
    toast({
      title: "Connection Status",
      description: "Connected with address: " + address,
    });

    return true;
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
