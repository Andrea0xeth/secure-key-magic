import { AuthenticationResult } from "../types/auth";
import { deriveAlgorandAccountFromCredential } from "../crypto/credentialDerivation";

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
    let privateKey = account.sk;
    if (privateKey.length !== 32) {
      console.warn("Private key length is not 32 bytes, adjusting...");
      const adjustedKey = new Uint8Array(32);
      adjustedKey.set(privateKey.slice(0, Math.min(privateKey.length, 32)));
      privateKey = adjustedKey;
    }

    console.log("Final private key length:", privateKey.length);

    return {
      address: account.addr,
      publicKey: account.addr,
      privateKey: privateKey
    };
  } catch (error) {
    console.error("Error authenticating with passkey:", error);
    throw error;
  }
}