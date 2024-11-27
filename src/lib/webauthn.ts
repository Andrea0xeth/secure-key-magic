import { generateKeyPairFromSeed } from '@solana/web3.js';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

export { authenticateWithPasskey } from './auth/passkeyAuth';
export { registerPasskey } from './auth/passkeyRegistration';
export type { AuthenticationResult, RegistrationResult } from './types/auth';

export function convertSignatureToBytes(signature: ArrayBuffer): Uint8Array {
  const signatureBytes = new Uint8Array(signature);
  if (signatureBytes.length !== 64) {
    throw new Error(`Invalid signature length: ${signatureBytes.length}. Expected 64 bytes`);
  }
  return signatureBytes;
}

export function validateKeyFormat(key: ArrayBuffer): void {
  if (!(key instanceof ArrayBuffer) || key.byteLength !== 32) {
    throw new Error('Invalid key format: Must be 32-byte ArrayBuffer');
  }
}

export async function registerPasskey(username: string): Promise<{
  publicKey: Uint8Array,
  credentialID: string
}> {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  
  // Generate a random 32-byte private key seed
  const privateSeed = new Uint8Array(32);
  crypto.getRandomValues(privateSeed);

  const publicKeyCredential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: {
        name: "Your App Name",
        id: window.location.hostname
      },
      user: {
        id: new TextEncoder().encode(username),
        name: username,
        displayName: username
      },
      pubKeyCredParams: [{
        type: "public-key",
        alg: -7 // ES256
      }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        requireResidentKey: true,
        userVerification: "required"
      }
    }
  }) as PublicKeyCredential;

  const attestationResponse = publicKeyCredential.response as AuthenticatorAttestationResponse;
  const credentialID = bytesToHex(new Uint8Array(attestationResponse.rawId));

  // Generate Solana keypair from the private seed
  const keypair = generateKeyPairFromSeed(privateSeed);

  // Store the private seed securely
  await storePrivateKey(credentialID, privateSeed);

  return {
    publicKey: keypair.publicKey.toBytes(),
    credentialID
  };
}