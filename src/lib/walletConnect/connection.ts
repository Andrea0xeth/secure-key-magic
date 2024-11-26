import { initSignClient } from './client';
import { setupSessionHandlers } from './sessionHandler';
import { toast } from "@/hooks/use-toast";
import { TransactionCallback } from './types';

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
    console.log("Attempting to pair with URI...");
    
    if (transactionCallback) {
      setupSessionHandlers(client, transactionCallback);
    }
    
    // First pair with the URI
    await client.pair({ uri: wcUrl });
    
    // Set up session proposal handler
    client.on("session_proposal", async (proposal) => {
      console.log("Received session proposal:", proposal);
      
      try {
        const { id, params } = proposal;
        
        const approvalResponse = await client.approve({
          id,
          namespaces: {
            algorand: {
              accounts: [`algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k:${address}`],
              methods: ['algo_signTxn'],
              events: ['accountsChanged'],
              chains: ['algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k']
            }
          }
        });
        
        console.log("Session proposal approved:", approvalResponse);
        toast({
          title: "Connected",
          description: "Successfully connected to dApp",
        });
      } catch (error) {
        console.error("Error approving session proposal:", error);
        toast({
          title: "Connection Failed",
          description: "Failed to approve session",
          variant: "destructive",
        });
      }
    });

    console.log("Connection successful");
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

    toast({
      title: "Disconnected",
      description: "Successfully disconnected from all dApps",
    });
    return true;
  } catch (error) {
    console.error("Error disconnecting WalletConnect:", error);
    toast({
      title: "Error",
      description: "Failed to disconnect",
      variant: "destructive",
    });
    throw error;
  }
}