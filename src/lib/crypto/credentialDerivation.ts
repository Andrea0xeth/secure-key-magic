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
  
  // Create a deterministic seed using SHA-256 to get exactly 32 bytes
  const privateKey = sha256(rawId);
  console.log("Generated 32-byte private key:", Array.from(privateKey).map(b => b.toString(16).padStart(2, '0')).join(''));
  
  // Generate Algorand account from the 32-byte private key
  const account = algosdk.Account.from(privateKey);
  console.log("Generated Algorand account with address:", account.addr);
  
  return account;
}

export function deriveKeyPair(credential: PublicKeyCredential): KeyPair {
  const account = deriveAlgorandAccountFromCredential(credential);
  return {
    mnemonic: algosdk.secretKeyToMnemonic(account.sk),
    address: account.addr
  };
}