import SignClient from '@walletconnect/sign-client';
import { handleTransactionRequest } from './transactionHandler';
import type { TransactionCallback } from './types';

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
      
      signClient.on("session_request", async (event) => {
        console.log("Received session request:", event);
        
        if (event.params.request.method === "algo_signTxn" && transactionCallback) {
          handleTransactionRequest(event.params.request.params[0][0], transactionCallback);
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