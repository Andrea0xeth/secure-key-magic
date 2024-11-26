import { AuthenticationResult } from "../types/auth";
import { deriveAlgorandAccountFromCredential } from "../crypto/credentialDerivation";
import { getStoredAlgorandKey } from "../storage/keyStorage";

export async function authenticateWithPasskey(): Promise<AuthenticationResult> {
  try {
    console.log("Starting passkey authentication...");
    
    // Get the stored key
    const storedKey = getStoredAlgorandKey();
    if (!storedKey) {
      console.error("No passkey registered");
      throw new Error("No passkey registered. Please register a passkey first.");
    }

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
      allowCredentials: [], // Allow any credential
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
    console.log("Stored key:", storedKey);
    console.log("Derived address:", account.addr.toString());

    // Verify that the derived address matches the stored one
    if (account.addr.toString() !== storedKey) {
      console.error("Authentication failed - address mismatch", {
        derived: account.addr.toString(),
        stored: storedKey
      });
      throw new Error("Authentication failed - invalid passkey");
    }

    return {
      address: account.addr.toString(),
      publicKey: account.addr.toString()
    };
  } catch (error) {
    console.error("Error authenticating with passkey:", error);
    throw error;
  }
}