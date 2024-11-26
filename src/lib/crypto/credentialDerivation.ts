import * as algosdk from "algosdk";

export function deriveAlgorandAccountFromCredential(credential: PublicKeyCredential): algosdk.Account {
  console.log("Deriving Algorand account from credential");
  
  // Get the raw credential ID as bytes
  const rawId = new Uint8Array(credential.rawId);
  console.log("Raw credential ID:", Buffer.from(rawId).toString('hex'));
  
  // Create a deterministic seed by using a consistent hashing method
  const encoder = new TextEncoder();
  const data = encoder.encode(credential.id);
  
  // Use the credential ID string which is stable across devices
  const seed = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    seed[i] = data[i % data.length];
  }
  
  // Generate deterministic account from seed
  const keypair = algosdk.generateAccountFromSeed(seed);
  console.log("Generated deterministic account with address:", keypair.addr);
  
  return keypair;
}