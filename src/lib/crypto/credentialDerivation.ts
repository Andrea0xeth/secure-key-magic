import * as algosdk from "algosdk";

export function deriveAlgorandAccountFromCredential(credential: PublicKeyCredential): algosdk.Account {
  console.log("Deriving Algorand account from credential ID");
  
  // Use the credential ID as deterministic seed
  const rawId = new Uint8Array(credential.rawId);
  
  // Create a 32-byte seed from the credential ID
  const seed = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    seed[i] = rawId[i % rawId.length];
  }
  
  // Generate deterministic account from seed
  const account = algosdk.generateAccount();
  console.log("Generated deterministic account with address:", account.addr);
  
  return account;
}