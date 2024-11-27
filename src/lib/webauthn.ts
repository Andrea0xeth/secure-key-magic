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