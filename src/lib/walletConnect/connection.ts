import SignClient from '@walletconnect/sign-client';
import { initSignClient } from './client';
import { handleTransactionRequest } from './transactionHandler';
import type { TransactionCallback } from './types';

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

    const pairResult = await client.pair({ uri: wcUrl });

    client.on('session_proposal', async (proposal) => {
      console.log("Received session proposal:", proposal);
      if (proposal.params.request?.method === "algo_signTxn") {
        handleTransactionRequest(proposal.params.request.params[0][0], transactionCallback!);
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

let transactionCallback: TransactionCallback | null = null;

export function setConnectionTransactionCallback(callback: TransactionCallback) {
  transactionCallback = callback;
}

export async function disconnectWalletConnect(): Promise<boolean> {
  try {
    const client = await initSignClient();
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