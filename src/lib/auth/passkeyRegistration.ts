import { RegistrationResult } from "../types/auth";
import { deriveAlgorandAccountFromCredential } from "../crypto/credentialDerivation";

export async function registerPasskey(): Promise<RegistrationResult> {
  try {
    console.log("Starting passkey registration...");
    
    if (!window.PublicKeyCredential) {
      console.error("WebAuthn is not supported in this browser");
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
        { type: "public-key", alg: -7 }, // ES256
        { type: "public-key", alg: -257 }, // RS256
      ],
      timeout: 60000,
      attestation: "direct",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "required",
      },
    };

    console.log("Creating credential with options:", createCredentialOptions);

    const credential = await navigator.credentials.create({
      publicKey: createCredentialOptions,
    }) as PublicKeyCredential;

    if (!credential) {
      console.error("No credential returned from credentials.create()");
      throw new Error("Registration failed - no credential returned");
    }

    console.log("Credential created successfully:", credential);

    const account = deriveAlgorandAccountFromCredential(credential);
    console.log("Derived Algorand account:", account);

    return {
      address: account.addr,
      publicKey: account.addr
    };
  } catch (error) {
    console.error("Error registering passkey:", error);
    throw error;
  }
}