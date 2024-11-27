import * as algosdk from "algosdk";
import { sha256 } from "@noble/hashes/sha256";
import { AuthenticationResult } from "../types/auth";

export interface KeyPair {
  mnemonic: string;
  address: string;
}

export function generateDeterministicPrivateKey(credential: PublicKeyCredential): Uint8Array {
  console.log("Generating deterministic private key from credential");
  
  // Get the raw credential ID as bytes
  const rawId = new Uint8Array(credential.rawId);
  console.log("Raw credential ID:", Buffer.from(rawId).toString('hex'));
  
  // Create a deterministic seed using SHA-256 which gives us exactly 32 bytes
  const privateKey = sha256(rawId);
  console.log("Generated private key (32 bytes):", Buffer.from(privateKey).toString('hex'));
  
  return privateKey;
}

export function deriveAlgorandAccountFromCredential(credential: PublicKeyCredential): AuthenticationResult {
  console.log("Deriving Algorand account from credential");
  
  // Generate the private key
  const privateKey = generateDeterministicPrivateKey(credential);
  
  // Create the account using algosdk
  const keys = algosdk.generateAccount();
  const account = {
    addr: keys.addr,
    sk: privateKey
  };
  
  console.log("Generated Algorand account with address:", account.addr);
  
  return {
    address: account.addr,
    publicKey: account.addr,
    privateKey: privateKey
  };
}

export function deriveKeyPair(credential: PublicKeyCredential): KeyPair {
  const privateKey = generateDeterministicPrivateKey(credential);
  const keys = algosdk.generateAccount();
  const account = {
    addr: keys.addr,
    sk: privateKey
  };
  
  return {
    mnemonic: algosdk.secretKeyToMnemonic(account.sk),
    address: account.addr
  };
}