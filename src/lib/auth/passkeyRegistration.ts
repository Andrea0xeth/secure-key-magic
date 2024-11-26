import { startRegistration } from "@simplewebauthn/browser";
import * as algosdk from "algosdk";
import { deriveKeyPair } from "../crypto/credentialDerivation";

export async function registerPasskey() {
  try {
    if (!window.PublicKeyCredential) {
      console.error("WebAuthn is not supported");
      throw new Error("WebAuthn is not supported in this browser");
    }

    // Generate a random challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Create credential options
    const createCredentialOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Algorand Passkeys",
        id: window.location.hostname,
      },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: `algorand-user-${Date.now()}`,
        displayName: "Algorand User",
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7, // ES256
        },
      ],
      timeout: 60000,
      attestation: "direct",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "required",
      },
    };

    console.log("Starting passkey registration...");
    const credential = await startRegistration(createCredentialOptions);
    console.log("Passkey registration successful:", credential);

    // Derive Algorand account from credential
    const keyPair = await deriveKeyPair(credential);
    const account = algosdk.mnemonicToSecretKey(keyPair.mnemonic);
    console.log("Derived Algorand account:", account);

    return {
      address: account.addr.toString(),
      publicKey: account.addr.toString()
    };
  } catch (error) {
    console.error("Error registering passkey:", error);
    throw error;
  }
}