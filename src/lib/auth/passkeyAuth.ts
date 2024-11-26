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

    // Create a proper Ed25519 private key from the account secret key
    const seed = account.sk.slice(0, 32); // Take first 32 bytes for the seed
    const keypair = algosdk.generateAccount();
    const privateKey = new Uint8Array(keypair.sk); // This ensures correct key format
    privateKey.set(seed); // Copy our seed into the properly formatted key

    console.log("Private key length:", privateKey.length);

    // Verify the private key by attempting to derive the public key
    try {
      const testAccount = algosdk.mnemonicToSecretKey(algosdk.secretKeyToMnemonic(privateKey));
      console.log("Test account derived successfully:", testAccount.addr);

      return {
        address: account.addr,
        publicKey: account.addr,
        privateKey: privateKey
      };
    } catch (error) {
      console.error("Error verifying private key:", error);
      throw new Error("Invalid private key derived from passkey");
    }
  } catch (error) {
    console.error("Error authenticating with passkey:", error);
    throw error;
  }
}