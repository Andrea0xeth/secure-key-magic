import { initSignClient } from './client';
import { toast } from "@/hooks/use-toast";
import { handleTransactionRequest } from './transactionHandler';
import type { TransactionCallback } from './types';

let transactionCallback: TransactionCallback | null = null;

export function setTransactionCallback(callback: TransactionCallback) {
  transactionCallback = callback;
  console.log("Transaction callback set");
}

export async function connectWithWalletConnect(wcUrl: string, address: string): Promise<boolean> {
  try {
    console.log("Processing WalletConnect URL:", wcUrl);
    
    if (!wcUrl.startsWith('wc:')) {
      throw new Error("Invalid WalletConnect URL format");
    }

    const client = await initSignClient();
    console.log("Pairing with URI...");
    await client.pair({ uri: wcUrl });

    // Connect with the dApp
    await client.connect({
      pairingTopic: wcUrl.split('@')[0].substring(3),
      requiredNamespaces: {
        algorand: {
          methods: ['algo_signTxn'],
          chains: ['algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k'],
          events: ['accountsChanged']
        }
      }
    });

    client.on('session_proposal', async (event) => {
      try {
        const { params } = event;
        if (params.requiredNamespaces?.algorand?.methods?.includes('algo_signTxn')) {
          console.log("Received sign transaction request");
          if (transactionCallback && params.request?.params?.[0]?.[0]) {
            await handleTransactionRequest(params.request.params[0][0], transactionCallback);
          }
        }
      } catch (error) {
        console.error("Error handling session proposal:", error);
        throw error;
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
    const client = await initSignClient();
    const sessions = client.session.values;
    
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