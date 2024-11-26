import { initSignClient } from './client';
import { handleSessionProposal } from './sessionHandler';
import { handleTransactionRequest } from './transactionHandler';
import type { TransactionCallback } from './types';
import { toast } from "@/hooks/use-toast";

export async function connectWithWalletConnect(wcUrl: string, address: string): Promise<boolean> {
  try {
    console.log("Processing WalletConnect URL:", wcUrl);
    
    if (!wcUrl.startsWith('wc:')) {
      throw new Error("Invalid WalletConnect URL format");
    }

    const client = await initSignClient({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      metadata: {
        name: 'Algorand Passkeys',
        description: 'Secure Algorand authentication using passkeys',
        url: window.location.host,
        icons: ['https://walletconnect.com/walletconnect-logo.png']
      }
    });

    // Set up event listeners
    client.on("session_proposal", async (proposal) => {
      try {
        await handleSessionProposal(client, proposal, address);
      } catch (error) {
        console.error("Error handling session proposal:", error);
      }
    });

    // Pair with the URI
    console.log("Pairing with URI...");
    await client.pair({ uri: wcUrl });

    console.log("Connection successful");
    return true;
  } catch (error) {
    console.error("Error in WalletConnect connection:", error);
    toast({
      title: "Connection Failed",
      description: "Failed to connect to dApp. Please try again.",
      variant: "destructive",
    });
    return false;
  }
}

export async function disconnectWalletConnect(): Promise<boolean> {
  try {
    const client = await initSignClient({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      metadata: {
        name: 'Algorand Passkeys',
        description: 'Secure Algorand authentication using passkeys',
        url: window.location.host,
        icons: ['https://walletconnect.com/walletconnect-logo.png']
      }
    });

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