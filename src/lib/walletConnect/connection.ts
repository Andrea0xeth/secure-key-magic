import SignClient from '@walletconnect/sign-client';
import { toast } from "@/hooks/use-toast";
import { handleTransactionRequest } from './transactionHandler';
import type { TransactionCallback, WalletConnectConfig } from './types';
import { initSignClient, getSignClient } from './client';

let transactionCallback: TransactionCallback | null = null;

export function setTransactionCallback(callback: TransactionCallback) {
  transactionCallback = callback;
  console.log("Transaction callback set");
}

export async function connectWithWalletConnect(wcUrl: string, address: string): Promise<boolean> {
  try {
    console.log("Processing WalletConnect URL:", wcUrl);
    console.log("Using Algorand address:", address);
    
    if (!wcUrl.startsWith('wc:')) {
      throw new Error("Invalid WalletConnect URL format");
    }

    const config: WalletConnectConfig = {
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      metadata: {
        name: 'Algorand Passkeys',
        description: 'Secure Algorand authentication using passkeys',
        url: window.location.host,
        icons: ['https://walletconnect.com/walletconnect-logo.png']
      }
    };

    const client = await initSignClient(config);
    
    client.on("session_request", async (event) => {
      console.log("Received session request:", event);
      
      const { params } = event;
      if (params.request.method === "algo_signTxn") {
        console.log("Received sign transaction request");
        
        try {
          const txnParams = params.request.params[0][0];
          if (transactionCallback) {
            await handleTransactionRequest(txnParams, transactionCallback);
          }
        } catch (error) {
          console.error("Error processing transaction:", error);
          toast({
            title: "Error",
            description: "Failed to process transaction",
            variant: "destructive",
          });
        }
      }
    });

    // Pair with the URI
    await client.pair({ uri: wcUrl });

    return true;
  } catch (error) {
    console.error("Error in WalletConnect connection:", error);
    throw error;
  }
}

export async function disconnectWalletConnect(): Promise<boolean> {
  try {
    const client = getSignClient();
    if (!client) {
      console.log("No active SignClient found");
      return false;
    }

    const sessions = client.session.values;
    console.log("Active sessions:", sessions);

    for (const session of sessions) {
      await client.disconnect({
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