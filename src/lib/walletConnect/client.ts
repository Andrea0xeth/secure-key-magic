import SignClient from '@walletconnect/sign-client';
import { toast } from "@/hooks/use-toast";
import type { WalletConnectConfig } from './types';

let signClient: SignClient | null = null;

export async function initSignClient(config: WalletConnectConfig): Promise<SignClient> {
  try {
    if (!signClient) {
      console.log("Initializing SignClient...");
      signClient = await SignClient.init(config);
      console.log("SignClient initialized successfully");
    }
    return signClient;
  } catch (error) {
    console.error("Error initializing SignClient:", error);
    toast({
      title: "Connection Error",
      description: "Failed to initialize WalletConnect",
      variant: "destructive",
    });
    throw error;
  }
}

export function getSignClient(): SignClient | null {
  return signClient;
}