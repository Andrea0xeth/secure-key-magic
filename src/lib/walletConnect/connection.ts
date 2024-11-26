import { initSignClient } from './client';
import { handleTransactionRequest } from './transactionHandler';
import { toast } from "@/hooks/use-toast";

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

    client.on('session_proposal', async (proposal) => {
      console.log("Received session proposal:", proposal);
      if (proposal.params.request?.method === "algo_signTxn") {
        handleTransactionRequest(proposal.params.request.params[0][0]);
      }
    });

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