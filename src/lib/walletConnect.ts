import SignClient from '@walletconnect/sign-client';
import type { SignClientTypes } from '@walletconnect/types';
import { toast } from "@/hooks/use-toast";
import { handleTransactionRequest } from './walletConnect/transactionHandler';
import { setTransactionCallback } from './walletConnect/transactionHandler';

let signClient: SignClient | null = null;

export { setTransactionCallback };

export async function initSignClient(): Promise<SignClient | null> {
  try {
    if (!signClient) {
      console.log("Initializing SignClient...");
      signClient = await SignClient.init({
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
        metadata: {
          name: 'Algorand Passkeys',
          description: 'Secure Algorand authentication using passkeys',
          url: window.location.host,
          icons: ['https://walletconnect.com/walletconnect-logo.png']
        }
      });
      
      signClient.on("session_request", async (event) => {
        console.log("Received session request:", event);
        
        if (!event.params?.request?.params) {
          console.error("Invalid session request format:", event);
          return;
        }

        const { request } = event.params;
        if (request.method === "algo_signTxn") {
          console.log("Received sign transaction request with params:", request.params);
          // Check if params is an array and has at least one element
          if (Array.isArray(request.params) && request.params.length > 0 && Array.isArray(request.params[0])) {
            const txnParams = request.params[0][0];
            console.log("Transaction parameters:", txnParams);
            if (txnParams && typeof txnParams === 'object' && 'txn' in txnParams) {
              handleTransactionRequest(txnParams);
            } else {
              console.error("Invalid transaction format:", txnParams);
            }
          } else {
            console.error("Invalid params format:", request.params);
          }
        }
      });
      
      console.log("SignClient initialized successfully");
    }
    return signClient;
  } catch (error) {
    console.error("Error initializing SignClient:", error);
    throw error;
  }
}

export async function connectWithWalletConnect(wcUrl: string, address: string): Promise<boolean> {
  try {
    console.log("Processing WalletConnect URL:", wcUrl);
    console.log("Using Algorand address:", address);
    
    if (!wcUrl.startsWith('wc:')) {
      throw new Error("Invalid WalletConnect URL format");
    }

    const client = await initSignClient();
    if (!client) {
      throw new Error("Failed to initialize SignClient");
    }

    console.log("Pairing with URI...");
    const pairResult = await client.pair({ uri: wcUrl });

    client.on('session_request', async (event: any) => {
      console.log("Received session request in connect:", event);
      
      if (!event.params?.request?.params) {
        console.error("Invalid session request format in connect:", event);
        return;
      }

      const { request } = event.params;
      if (request.method === "algo_signTxn" && Array.isArray(request.params) && request.params.length > 0) {
        console.log("Received sign transaction request in connect with params:", request.params);
        handleTransactionRequest(request.params[0][0]);
      }
    });

    const connectResult = await client.connect({
      pairingTopic: wcUrl.split('@')[0].substring(3),
      requiredNamespaces: {
        algorand: {
          methods: ['algo_signTxn'],
          chains: ['algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k'],
          events: ['accountsChanged']
        }
      }
    });

    console.log("Connection successful");
    return true;
  } catch (error) {
    console.error("Error in WalletConnect connection:", error);
    throw error;
  }
}

export async function disconnectWalletConnect(): Promise<boolean> {
  try {
    if (!signClient) {
      console.log("No active SignClient found");
      return false;
    }

    const sessions = signClient.session.values;
    console.log("Active sessions:", sessions);

    for (const session of sessions) {
      await signClient.disconnect({
        topic: session.topic,
        reason: {
          code: 6000,
          message: "User disconnected"
        }
      });
    }

    console.log("Successfully disconnected all sessions");
    return true;
  } catch (error) {
    console.error("Error disconnecting WalletConnect:", error);
    throw error;
  }
}