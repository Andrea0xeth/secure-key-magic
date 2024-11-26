import * as algosdk from "algosdk";

export interface KeyPair {
  mnemonic: string;
  address: string;
}

export function deriveKeyPair(credential: PublicKeyCredential): KeyPair {
  console.log("Deriving key pair from credential");
  
  // Get the raw credential ID as bytes
  const rawId = new Uint8Array(credential.rawId);
  console.log("Raw credential ID:", Array.from(rawId).map(b => b.toString(16).padStart(2, '0')).join(''));
  
  // Create a deterministic seed
  const seed = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    seed[i] = rawId[i % rawId.length];
  }
  
  // Generate deterministic account from seed
  const mnemonic = algosdk.secretKeyToMnemonic(seed);
  const account = algosdk.mnemonicToSecretKey(mnemonic);
  
  console.log("Generated deterministic account with address:", account.addr);
  
  return {
    mnemonic,
    address: account.addr
  };
}