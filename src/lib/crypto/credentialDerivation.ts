import * as algosdk from "algosdk";
import { sha256 } from "@noble/hashes/sha256";

export interface KeyPair {
  mnemonic: string;
  address: string;
}

export function deriveAlgorandAccountFromCredential(credential: PublicKeyCredential): algosdk.Account {
  console.log("Deriving Algorand account from credential");
  
  // Get the raw credential ID as bytes
  const rawId = new Uint8Array(credential.rawId);
  console.log("Raw credential ID:", Array.from(rawId).map(b => b.toString(16).padStart(2, '0')).join(''));
  
  // Create a deterministic seed using SHA-256
  const seed = sha256(rawId);
  console.log("Generated deterministic seed:", Array.from(seed).map(b => b.toString(16).padStart(2, '0')).join(''));
  
  // Generate account using the deterministic seed
  const privateKey = new Uint8Array(64);
  privateKey.set(seed);
  
  const account = algosdk.mnemonicToSecretKey(algosdk.secretKeyToMnemonic(privateKey));
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