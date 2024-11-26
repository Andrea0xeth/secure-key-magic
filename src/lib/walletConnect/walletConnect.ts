import { initSignClient } from './client';
import * as algosdk from 'algosdk';
import { authenticateWithPasskey as webAuthnAuthenticate } from '../webauthn';

export async function authenticateWithPasskey(): Promise<{ address: string } | null> {
  try {
    console.log("Starting WebAuthn authentication...");
    const authResult = await webAuthnAuthenticate();
    
    if (!authResult) {
      console.error("WebAuthn authentication failed");
      return null;
    }

    console.log("WebAuthn authentication successful:", authResult);
    return {
      address: authResult.address
    };
  } catch (error) {
    console.error("Error in passkey authentication:", error);
    return null;
  }
}