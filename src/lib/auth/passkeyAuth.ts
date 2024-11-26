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

    const seed = account.sk.slice(0, 32);
    console.log("Seed length:", seed.length);

    const algorandAccount = algosdk.generateAccount();
    const privateKey = algorandAccount.sk;

    console.log("Generated Algorand private key length:", privateKey.length);
    
    try {
      const testTxn = new algosdk.Transaction({
        from: algorandAccount.addr,
        to: algorandAccount.addr,
        amount: 0,
        suggestedParams: {
          fee: 1000,
          firstValid: 1,
          lastValid: 1000,
          genesisID: "mainnet-v1.0",
          genesisHash: Buffer.from("wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=", 'base64')
        }
      });
      
      const signedTest = algosdk.signTransaction(testTxn, privateKey);
      console.log("Private key validation successful");

      return {
        address: algorandAccount.addr,
        publicKey: algorandAccount.addr,
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