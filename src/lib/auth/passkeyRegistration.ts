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
    const createCredentialOptions = {
      challenge: Buffer.from(challenge).toString('base64'),
      rp: {
        name: "Algorand Passkeys",
        id: window.location.hostname,
      },
      user: {
        id: Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64'),
        name: `algorand-user-${Date.now()}`,
        displayName: "Algorand User",
      },
      pubKeyCredParams: [{
        type: "public-key" as const,
        alg: -7, // ES256
      }],
      timeout: 60000,
      attestation: "direct" as const,
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "required",
      },
    };

    console.log("Starting passkey registration...");
    const credential = await startRegistration(createCredentialOptions);
    console.log("Passkey registration successful:", credential);

    // Create a mock credential for deriveKeyPair since we can't convert RegistrationResponseJSON to PublicKeyCredential
    const mockCredential = {
      id: credential.id,
      rawId: Buffer.from(credential.rawId),
      type: 'public-key',
      getClientExtensionResults: () => ({}),
    } as PublicKeyCredential;

    const keyPair = deriveKeyPair(mockCredential);
    console.log("Derived key pair:", keyPair);

    return {
      address: keyPair.address,
      publicKey: keyPair.address
    };
  } catch (error) {
    console.error("Error registering passkey:", error);
    throw error;
  }
}