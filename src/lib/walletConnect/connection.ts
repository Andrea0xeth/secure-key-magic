import { initSignClient } from './client';
import { handleTransactionRequest } from './transactionHandler';
import { toast } from "@/hooks/use-toast";
import { SessionTypes } from '@walletconnect/types';

export async function connectWithWalletConnect(wcUrl: string, address: string): Promise<boolean> {
  try {
    console.log("Processing WalletConnect URL:", wcUrl);
    console.log("Using Algorand address:", address);
    
    if (!wcUrl.startsWith('wc:')) {
      throw new Error("Invalid WalletConnect URL format");
    }

    const client = await initSignClient();
    console.log("Pairing with URI...");
    await client.pair({ uri: wcUrl });

    client.on('session_proposal', async (event: { id: number, params: SessionTypes.Proposal }) => {
      console.log("Received session proposal:", event);
      try {
        const { id, params } = event;
        const namespaces = {
          algorand: {
            accounts: [`algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k:${address}`],
            methods: ['algo_signTxn'],
            events: ['accountsChanged']
          }
        };

        await client.approve({
          id,
          namespaces
        });

        console.log("Session proposal approved");
      } catch (error) {
        console.error("Error handling session proposal:", error);
        await client.reject({
          id: event.id,
          reason: {
            code: 4001,
            message: "User rejected the session"
          }
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

    // Clear stored session data
    localStorage.removeItem('wc@2:client:0.3//session');
    localStorage.removeItem('wc@2:core:0.3//pairing');
    localStorage.removeItem('wc@2:core:0.3//expirer');
    localStorage.removeItem('wc@2:core:0.3//history');
    
    console.log("Successfully disconnected all sessions");
    return true;
  } catch (error) {
    console.error("Error disconnecting WalletConnect:", error);
    throw error;
  }
}