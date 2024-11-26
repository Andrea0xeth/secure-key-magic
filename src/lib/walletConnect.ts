import { SignClient } from '@walletconnect/sign-client';

let signClient: SignClient | null = null;

export async function initSignClient() {
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
    
    // Extract the URI without query parameters
    const uri = wcUrl.split('?')[0];
    
    console.log("Attempting to pair with URI:", uri);

    const { approval } = await client.pair({ uri });

    console.log("Pairing with dApp...");
    
    try {
      const session = await approval();
      console.log("Session established:", session);

      await client.update({
        topic: session.topic,
        namespaces: {
          algorand: {
            accounts: [`algorand:mainnet:${address}`],
            methods: [
              'algorand_signTransaction',
              'algorand_signTxnGroup',
            ],
            events: ['accountsChanged']
          }
        }
      });

      console.log("Session updated with address:", address);
      return true;
    } catch (approvalError) {
      console.error("Error during session approval:", approvalError);
      throw approvalError;
    }
  } catch (error) {
    console.error("Error in WalletConnect connection:", error);
    throw error;
  }
}