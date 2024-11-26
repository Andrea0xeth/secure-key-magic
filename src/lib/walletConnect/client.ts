import SignClient from '@walletconnect/sign-client';
import { WALLET_CONNECT_CONFIG } from './config';

let signClient: SignClient | null = null;

export async function initSignClient(): Promise<SignClient> {
  try {
    if (!signClient) {
      console.log("Initializing SignClient...");
      signClient = await SignClient.init(WALLET_CONNECT_CONFIG);
      console.log("SignClient initialized successfully");
    }
    return signClient;
  } catch (error) {
    console.error("Error initializing SignClient:", error);
    throw error;
  }
}

export function getSignClient(): SignClient | null {
  return signClient;
}