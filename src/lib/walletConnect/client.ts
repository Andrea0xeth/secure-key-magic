import SignClient from '@walletconnect/sign-client';
import { WALLET_CONNECT_CONFIG } from './config';
import { SignClientType } from './types';

let signClient: SignClientType | null = null;

export async function initSignClient(): Promise<SignClientType> {
  try {
    if (!signClient) {
      console.log("Initializing SignClient with config:", WALLET_CONNECT_CONFIG);
      signClient = await SignClient.init(WALLET_CONNECT_CONFIG) as SignClientType;
      console.log("SignClient initialized successfully");
    }
    return signClient;
  } catch (error) {
    console.error("Error initializing SignClient:", error);
    throw error;
  }
}

export function getSignClient(): SignClientType | null {
  return signClient;
}