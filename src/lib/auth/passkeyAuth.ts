import { AuthenticationResult } from "../types/auth";
import { deriveAlgorandAccountFromCredential } from "../crypto/credentialDerivation";
import * as algosdk from "algosdk";

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

    return {
      address: account.addr,
      publicKey: account.addr,
      privateKey: account.sk
    };
  } catch (error) {
    console.error("Error authenticating with passkey:", error);
    throw error;
  }
}

async function signTransaction(transaction: any, credential: PublicKeyCredential) {
  try {
    // Validate the credential before using it
    if (!credential.response || !credential.response.signature) {
      throw new Error('Invalid credential response');
    }

    const signature = credential.response.signature;
    // Convert the signature to the expected format
    const signatureBytes = convertSignatureToBytes(signature);
    
    // Add logging to help debug
    console.log('Signature bytes length:', signatureBytes.length);
    console.log('Signature bytes:', signatureBytes);

    return signatureBytes;
  } catch (error) {
    console.error('Error in signTransaction:', error);
    throw error;
  }
}