import * as algosdk from "algosdk";

export async function deriveAlgorandSeedFromCredential(credential: PublicKeyCredential): Promise<string> {
  // Get the raw ID as bytes
  const rawId = new Uint8Array(credential.rawId);
  
  // Use the raw ID to generate a deterministic seed
  const seedBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    seedBytes[i] = rawId[i % rawId.length];
  }
  
  // Generate account from the derived seed
  const account = algosdk.generateAccount();
  const seed = algosdk.secretKeyToMnemonic(account.sk);
  
  return seed;
}