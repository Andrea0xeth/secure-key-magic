import { AuthenticationResult } from "../types/auth";
import { deriveAlgorandAccountFromCredential } from "../crypto/credentialDerivation";
import * as algosdk from "algosdk";
import { convertSignatureToBytes } from "../webauthn";

export async function authenticateWithPasskey(): Promise<AuthenticationResult> {
  try {
    console.log("Starting passkey authentication...");

    if (!window.PublicKeyCredential) {
      console.error("WebAuthn is not supported in this browser");
      throw new Error("WebAuthn is not supported in this browser");
    }

    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const getCredentialOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: "required",
      rpId: window.location.hostname,
      allowCredentials: [], // Allow any credential for cross-device authentication
    };

    console.log("Requesting credential with options:", getCredentialOptions);

    const assertion = await navigator.credentials.get({
      publicKey: getCredentialOptions
    }) as PublicKeyCredential;

    if (!assertion) {
      console.error("No assertion returned from credentials.get()");
      throw new Error("Authentication failed - no credential returned");
    }

    console.log("Credential assertion received:", assertion);

    const account = deriveAlgorandAccountFromCredential(assertion);
    console.log("Derived Algorand account:", account);

    return account;
  } catch (error) {
    console.error("Error authenticating with passkey:", error);
    throw error;
  }
}

async function signTransaction(transaction: algosdk.Transaction, credential: PublicKeyCredential) {
  try {
    const response = credential.response as AuthenticatorAssertionResponse;
    if (!response || !response.signature) {
      throw new Error('Invalid credential response');
    }

    const account = deriveAlgorandAccountFromCredential(credential);
    
    try {
      const signedTxn = transaction.signTxn(account.sk);
      return signedTxn;
    } catch (error) {
      console.error('Error signing with algosdk:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in signTransaction:', error);
    throw error;
  }
}