import { SignClientTypes } from "@walletconnect/types";
import * as algosdk from "algosdk";
import { TransactionCallback } from "./types";

let transactionCallback: TransactionCallback | null = null;

export function setTransactionCallback(callback: TransactionCallback) {
  transactionCallback = callback;
}

export function handleTransactionRequest(params: any) {
  console.log("Handling transaction request with params:", params);

  if (!transactionCallback) {
    console.error("No transaction callback set");
    return;
  }

  try {
    console.log("Decoding transaction from base64:", params.txn);
    const decodedTxn = algosdk.decodeObj(Buffer.from(params.txn, 'base64'));
    console.log("Decoded transaction:", decodedTxn);

    if (!decodedTxn) {
      console.error("Failed to decode transaction");
      throw new Error("Invalid transaction parameters");
    }

    // Ensure we have the required address fields
    const senderAddress = (decodedTxn as any).snd ? algosdk.encodeAddress((decodedTxn as any).snd) : null;
    const receiverAddress = (decodedTxn as any).rcv ? algosdk.encodeAddress((decodedTxn as any).rcv) : null;

    if (!senderAddress) {
      console.error("Sender address is missing in transaction");
      throw new Error("Sender address must not be null or undefined");
    }

    // Create a proper Algorand transaction object with required fields
    const txn = new algosdk.Transaction({
      from: senderAddress,
      to: receiverAddress || senderAddress, // fallback to sender if receiver is not specified
      amount: (decodedTxn as any).amt || 0,
      fee: (decodedTxn as any).fee || 1000, // default minimum fee
      firstRound: (decodedTxn as any).fv || 0,
      lastRound: (decodedTxn as any).lv || 0,
      genesisHash: (decodedTxn as any).gh || '',
      genesisID: (decodedTxn as any).gen || '',
      type: (decodedTxn as any).type || 'pay',
      note: (decodedTxn as any).note,
      group: (decodedTxn as any).grp,
    });

    console.log("Created Algorand transaction object:", txn);
    transactionCallback(txn);
  } catch (error) {
    console.error("Error handling transaction request:", error);
    throw error;
  }
}