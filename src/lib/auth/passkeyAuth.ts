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

    if (!algosdk.isValidAddress(account.addr.toString())) {
      throw new Error("Invalid Algorand address derived from passkey");
    }

    const privateKeyBytes = account.sk.slice(0, 32);
    console.log("Original private key length:", account.sk.length);
    console.log("Adjusted private key length:", privateKeyBytes.length);
    
    try {
      const testTxn = new algosdk.Transaction({
        from: account.addr,
        to: account.addr,
        amount: 0,
        suggestedParams: {
          fee: 1000,
          firstRound: 1,
          lastRound: 1000,
          genesisID: "mainnet-v1.0",
          genesisHash: Buffer.from("wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=", 'base64')
        }
      });
      
      const signedTest = algosdk.signTransaction(testTxn, privateKeyBytes);
      console.log("Private key validation successful");

      return {
        address: account.addr.toString(),
        publicKey: account.addr.toString(),
        privateKey: privateKeyBytes
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