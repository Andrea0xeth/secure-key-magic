import { initSignClient } from './client';
import { toast } from "@/hooks/use-toast";
import SignClient from '@walletconnect/sign-client';

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

    console.log("Pairing with URI...");
    const pairResult = await client.pair({ uri: wcUrl });
    console.log("Pairing result:", pairResult);

    // Configure client to skip verification
    (client as any).core.verify = {
      register: async () => true,
      resolve: async () => ({ attestationId: 'mock', verifyUrl: '' }),
    };

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