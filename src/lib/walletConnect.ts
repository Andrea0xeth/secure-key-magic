import { SignClient } from '@walletconnect/sign-client';
import type { SignClientTypes } from '@walletconnect/types';

let signClient: SignClient | null = null;

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
    const { uri, approval } = await client.pair({ uri: wcUrl });

    // Set up session proposal listener before connecting
    client.on('session_proposal', async (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      console.log("Received session proposal:", proposal);
      try {
        // Extract the required chains from the proposal
        const requiredChains = proposal.params.requiredNamespaces.algorand.chains;
        console.log("Required chains:", requiredChains);

        // Create namespaces matching the required chains
        const namespaces = {
          algorand: {
            methods: [
              'algorand_signTransaction',
              'algorand_signTxnGroup',
            ],
            chains: requiredChains,
            events: ['accountsChanged'],
            accounts: requiredChains.map(chain => `${chain}:${address}`)
          }
        };

        console.log("Approving with namespaces:", namespaces);
        const { acknowledged } = await client.approve({
          id: proposal.id,
          namespaces
        });
        
        await acknowledged();
        console.log("Session approved and acknowledged");
      } catch (error) {
        console.error("Error handling session proposal:", error);
        throw error;
      }
    });

    // Connect with the dApp
    const { topic, acknowledged } = await client.connect({
      pairingTopic: wcUrl.split('@')[0].substring(3),
      requiredNamespaces: {
        algorand: {
          methods: [
            'algorand_signTransaction',
            'algorand_signTxnGroup',
          ],
          chains: ['algorand:mainnet'],
          events: ['accountsChanged']
        }
      }
    });

    await acknowledged();
    console.log("Connection successful with topic:", topic);
    return true;
  } catch (error) {
    console.error("Error in WalletConnect connection:", error);
    throw error;
  }
}