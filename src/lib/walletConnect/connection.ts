import SignClient from '@walletconnect/sign-client';
import { initSignClient } from './client';
import { handleSessionProposal } from './sessionHandler';
import { handleTransactionRequest } from './transactionHandler';
import type { TransactionCallback, SessionProposal } from './types';
import { toast } from "@/hooks/use-toast";

let transactionCallback: TransactionCallback | null = null;

export function setConnectionTransactionCallback(callback: TransactionCallback) {
  transactionCallback = callback;
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
    await client.pair({ uri: wcUrl });

    client.on('session_proposal', async (proposal: SessionProposal) => {
      console.log("Received session proposal");
      await handleSessionProposal(client, proposal, address);
    });

    client.on('session_request', async (event) => {
      console.log("Received session request:", event);
      if (event.params?.request?.method === "algo_signTxn" && transactionCallback) {
        await handleTransactionRequest(event.params.request.params[0][0], transactionCallback);
      }
    });

    return true;
  } catch (error) {
    console.error("Error in WalletConnect connection:", error);
    toast({
      title: "Connection Failed",
      description: "Failed to connect to dApp. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
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