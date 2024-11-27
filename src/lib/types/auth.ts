export interface AuthenticationResult {
  address: string;
  publicKey: string;
  privateKey: Uint8Array;
  addr: string;  // For compatibility with algosdk account
  sk: Uint8Array; // For compatibility with algosdk account
}

export interface RegistrationResult {
  address: string;
  publicKey: string;
}