export { authenticateWithPasskey } from './auth/passkeyAuth';
export { registerPasskey } from './auth/passkeyRegistration';
export type { AuthenticationResult, RegistrationResult } from './types/auth';

export const authenticateWithPasskey = async (): Promise<{ privateKey: Uint8Array } | null> => {
  try {
    // ... codice esistente per l'autenticazione ...

    // Assicurati che la chiave privata sia nel formato corretto
    const privateKey = new Uint8Array(/* ... la tua chiave privata ... */);
    
    // Verifica che la chiave sia di 32 bytes
    if (privateKey.length !== 32) {
      console.warn("Private key length is not 32 bytes, adjusting...");
      const adjustedKey = new Uint8Array(32);
      adjustedKey.set(privateKey.slice(0, 32));
      return { privateKey: adjustedKey };
    }

    return { privateKey };
  } catch (error) {
    console.error("Authentication failed:", error);
    return null;
  }
};