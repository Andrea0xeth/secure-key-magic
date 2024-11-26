import { initSignClient } from './client';
import { toast } from "@/hooks/use-toast";
import { handleTransactionRequest } from './transactionHandler';
import type { TransactionCallback, SessionProposalEvent } from './types';
import type { SignClientTypes } from '@walletconnect/types';

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
    console.log("Pairing with URI...");
    
    const pairings = await client.pair({ uri: wcUrl });
    const topic = pairings.topic;

    // Set up session proposal handler
    client.on('session_proposal', async (event: SignClientTypes.EventArguments['session_proposal']) => {
      try {
        console.log("Received session proposal:", event);
        
        await client.approve({
          id: event.id,
          namespaces: {
            algorand: {
              accounts: [`algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k:${address}`],
              methods: ['algo_signTxn'],
              events: ['accountsChanged'],
              chains: ['algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k']
            }
          }
        });

        if (event.params.request?.method === 'algo_signTxn' && transactionCallback) {
          const txnParams = event.params.request.params?.[0]?.[0];
          if (txnParams) {
            await handleTransactionRequest(txnParams, transactionCallback);
          }
        }
      } catch (error) {
        console.error("Error handling session proposal:", error);
        toast({
          title: "Connection Error",
          description: "Failed to establish connection with dApp",
          variant: "destructive",
        });
        throw error;
      }
    });

    // Connect with the dApp
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