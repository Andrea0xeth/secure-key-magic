export interface AuthenticationResult {
  address: string;
  publicKey: string;
  privateKey: Uint8Array;
  addr?: string;  // Adding this for compatibility with algosdk account
  sk?: Uint8Array; // Adding this for compatibility with algosdk account
}

export interface RegistrationResult {
  address: string;
  publicKey: string;
}