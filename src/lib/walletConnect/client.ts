import SignClient from '@walletconnect/sign-client';
import { handleSessionProposal } from './sessionHandler';
import type { TransactionCallback } from './types';
import { toast } from "@/hooks/use-toast";

let signClient: SignClient | null = null;
let transactionCallback: TransactionCallback | null = null;

export function setTransactionCallback(callback: TransactionCallback) {
  transactionCallback = callback;
  console.log("Transaction callback set");
}

export async function initSignClient(): Promise<SignClient | null> {
  try {
    if (!signClient) {
      console.log("Initializing SignClient...");
      signClient = await SignClient.init({
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
        metadata: {
          name: 'Algorand Passkeys',
          description: 'Secure Algorand authentication using passkeys',
          url: window.location.host,
          icons: ['https://walletconnect.com/walletconnect-logo.png']
        }
      });

      signClient.on("session_proposal", async (event) => {
        try {
          await handleSessionProposal(signClient!, event);
        } catch (error) {
          console.error("Error handling session proposal:", error);
          toast({
            title: "Connection Failed",
            description: "Failed to establish connection. Please try again.",
            variant: "destructive",
          });
        }
      });
      
      console.log("SignClient initialized successfully");
    }
    return signClient;
  } catch (error) {
    console.error("Error initializing SignClient:", error);
    throw error;
  }
}