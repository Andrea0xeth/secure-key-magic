import { initSignClient, getSignClient } from './client';
import { handleSessionProposal } from './sessionHandler';
import { handleTransactionRequest } from './transactionHandler';
import type { TransactionCallback } from './types';
import type { SignClientTypes } from '@walletconnect/types';

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

    const client = await initSignClient();

    client.on("session_proposal", async (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      await handleSessionProposal(client, proposal, address);
    });

    client.on("session_request", async (event: SignClientTypes.EventArguments['session_request']) => {
      if (event.params.request.method === "algo_signTxn" && transactionCallback) {
        await handleTransactionRequest(event.params.request.params[0][0], transactionCallback);
      }
    });

    await client.pair({ uri: wcUrl });
    console.log("Successfully paired with WalletConnect URI");

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