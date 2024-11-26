import SignClient from '@walletconnect/sign-client';
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