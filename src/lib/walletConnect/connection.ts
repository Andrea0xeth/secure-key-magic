import { initSignClient } from './client';
import { toast } from "@/hooks/use-toast";
import * as algosdk from "algosdk";

export async function connectWithWalletConnect(wcUrl: string, address: string): Promise<boolean> {
  try {
    console.log("Processing WalletConnect URL:", wcUrl);
    
    if (!wcUrl.startsWith('wc:')) {
      throw new Error("Invalid WalletConnect URL format");
    }

    const client = await initSignClient();
    if (!client) {
      throw new Error("Failed to initialize SignClient");
    }

    // Configure client to skip verification
    (client as any).core.verify = {
      register: async () => true,
      resolve: async () => ({ attestationId: 'mock', verifyUrl: '' }),
    };

    // Connect with required namespaces before pairing
    const requiredNamespaces = {
      algorand: {
        methods: ['algo_signTxn'],
        chains: ['algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k'],
        events: ['accountsChanged']
      }
    };

    console.log("Pairing with URI...");
    await client.pair({ uri: wcUrl });

    // Establish session with required namespaces
    await client.connect({
      requiredNamespaces,
      pairingTopic: wcUrl.split('@')[0].substring(3)
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
    return false;
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