import SignClient from '@walletconnect/sign-client';
import { initSignClient } from './client';
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

    const pairResult = await client.pair({ uri: wcUrl });

    client.on('session_proposal', async (proposal: SessionProposal) => {
      console.log("Received session proposal:", proposal);
      try {
        // Connect with the dApp using the proposal parameters
        await client.approve({
          id: proposal.id,
          namespaces: {
            algorand: {
              accounts: [`algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k:${address}`],
              methods: ['algo_signTxn'],
              events: ['accountsChanged']
            }
          }
        });
      } catch (error) {
        console.error("Error handling session proposal:", error);
        toast({
          title: "Connection Failed",
          description: "Failed to establish connection with dApp",
          variant: "destructive",
        });
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