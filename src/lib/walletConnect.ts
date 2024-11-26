import SignClient from '@walletconnect/sign-client';
import type { SignClientTypes } from '@walletconnect/types';
import { toast } from "@/hooks/use-toast";
import * as algosdk from "algosdk";

let signClient: SignClient | null = null;
let transactionCallback: ((transaction: algosdk.Transaction) => void) | null = null;

interface DecodedAlgorandTransaction {
  type?: string;
  snd?: Uint8Array;
  rcv?: Uint8Array;
  amt?: number;
  fee?: number;
  fv?: number;
  lv?: number;
  note?: Uint8Array;
  gen?: string;
  gh?: string;
}

export function setTransactionCallback(callback: (transaction: algosdk.Transaction) => void) {
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
        
        const { params } = event;
        if (params.request.method === "algo_signTxn") {
          console.log("Received sign transaction request");
          
          try {
            const txnParams = params.request.params[0][0];
            console.log("Transaction params:", txnParams);
            
            // Decode the transaction from msgpack format
            const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64')) as DecodedAlgorandTransaction;
            console.log("Decoded transaction:", decodedTxn);
            
            // Create a new transaction object with proper typing
            const transaction = new algosdk.Transaction({
              type: decodedTxn.type || 'pay',
              from: decodedTxn.snd,
              to: decodedTxn.rcv,
              amount: decodedTxn.amt || 0,
              fee: decodedTxn.fee || 0,
              firstRound: decodedTxn.fv || 0,
              lastRound: decodedTxn.lv || 0,
              note: decodedTxn.note,
              genesisID: decodedTxn.gen || '',
              genesisHash: decodedTxn.gh || '',
            });
            
            if (transactionCallback) {
              console.log("Calling transaction callback with transaction:", transaction);
              transactionCallback(transaction);
            } else {
              console.error("No transaction callback set");
              toast({
                title: "Error",
                description: "Transaction handler not initialized",
                variant: "destructive",
              });
            }
          } catch (error) {
            console.error("Error processing transaction:", error);
            toast({
              title: "Error",
              description: "Failed to process transaction",
              variant: "destructive",
            });
          }
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

export async function connectWithWalletConnect(wcUrl: string, address: string): Promise<boolean> {
  try {
    console.log("Processing WalletConnect URL:", wcUrl);
    console.log("Using Algorand address:", address);
    
    if (!wcUrl.startsWith('wc:')) {
      throw new Error("Invalid WalletConnect URL format");
    }

    const client = await initSignClient();
    if (!client) {
      throw new Error("Failed to initialize SignClient");
    }

    // First pair with the URI
    console.log("Pairing with URI...");
    const pairResult = await client.pair({ uri: wcUrl });

    // Set up session proposal listener before connecting
    client.on('session_proposal', async (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      console.log("Received session proposal:", proposal);
      try {
        // Extract the required chains and methods from the proposal
        const requiredNamespace = proposal.params.requiredNamespaces.algorand;
        const requiredChains = requiredNamespace.chains;
        const requiredMethods = requiredNamespace.methods;
        
        console.log("Required chains:", requiredChains);
        console.log("Required methods:", requiredMethods);

        // Create namespaces matching the required chains and methods
        const namespaces = {
          algorand: {
            methods: requiredMethods,
            chains: requiredChains,
            events: ['accountsChanged'],
            accounts: requiredChains.map(chain => `${chain}:${address}`)
          }
        };

        console.log("Approving with namespaces:", namespaces);
        const session = await client.approve({
          id: proposal.id,
          namespaces
        });
        
        console.log("Session approved and acknowledged");
      } catch (error) {
        console.error("Error handling session proposal:", error);
        throw error;
      }
    });

    // Connect with the dApp using the same required namespaces from the proposal
    const connectResult = await client.connect({
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
    if (!signClient) {
      console.log("No active SignClient found");
      return false;
    }

    const sessions = signClient.session.values;
    console.log("Active sessions:", sessions);

    for (const session of sessions) {
      await signClient.disconnect({
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
