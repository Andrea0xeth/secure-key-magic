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

    // Ensure the private key is exactly 32 bytes
    let privateKey = account.sk.slice(0, 32); // Take only first 32 bytes
    console.log("Adjusted private key length:", privateKey.length);

    // Test the private key with a dummy transaction
    try {
      const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', '');
      const params = await algodClient.getTransactionParams().do();
      
      const testTxn = new algosdk.Transaction({
        from: account.addr,
        to: account.addr,
        amount: 0,
        suggestedParams: params
      });

      const signedTest = algosdk.signTransaction(testTxn, privateKey);
      console.log("Private key validation successful");

      return {
        address: account.addr,
        publicKey: account.addr,
        privateKey: privateKey
      };
    } catch (error) {
      console.error("Invalid private key:", error);
      throw new Error("Invalid private key derived from passkey");
    }
  } catch (error) {
    console.error("Error authenticating with passkey:", error);
    throw error;
  }
}