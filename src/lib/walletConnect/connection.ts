import { initSignClient } from './client';
import { toast } from "@/hooks/use-toast";

export async function connectWithWalletConnect(wcUrl: string, address: string): Promise<boolean> {
  try {
    console.log("Processing WalletConnect URL:", wcUrl);
    
    if (!wcUrl.startsWith('wc:')) {
      throw new Error("Invalid WalletConnect URL format");
    }

    const client = await initSignClient();
    console.log("Pairing with URI...");
    
    const pairings = await client.pair({ uri: wcUrl });
    const topic = pairings.topic;

    await client.connect({
      pairingTopic: topic,
      requiredNamespaces: {
        algorand: {
          methods: ['algo_signTxn'],
          chains: ['algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k'],
          events: ['accountsChanged']
        }
      }
    });

    console.log("Connection successful");
    toast({
      title: "Connected",
      description: "Successfully connected to dApp",
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