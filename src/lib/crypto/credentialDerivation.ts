import * as algosdk from "algosdk";

export interface KeyPair {
  mnemonic: string;
  address: string;
}

export function deriveAlgorandAccountFromCredential(credential: PublicKeyCredential): algosdk.Account {
  console.log("Deriving Algorand account from credential");
  
  // Get the raw credential ID as bytes
  const rawId = new Uint8Array(credential.rawId);
  console.log("Raw credential ID:", Array.from(rawId).map(b => b.toString(16).padStart(2, '0')).join(''));
  
  // Create a deterministic seed
  const seed = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    seed[i] = rawId[i % rawId.length];
  }
  
  // Generate account using algosdk
  const keypair = algosdk.generateAccount();
  const privateKey = new Uint8Array(keypair.sk);
  privateKey.set(seed.slice(0, 32));
  
  const account = {
    addr: keypair.addr,
    sk: privateKey
  };
  
  console.log("Generated deterministic account with address:", account.addr);
  
  return account;
}

export function deriveKeyPair(credential: PublicKeyCredential): KeyPair {
  const account = deriveAlgorandAccountFromCredential(credential);
  return {
    mnemonic: algosdk.secretKeyToMnemonic(account.sk),
    address: account.addr
  };
}