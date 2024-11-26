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

    // Create a proper Algorand transaction object
    const txn = new algosdk.Transaction({
      from: algosdk.encodeAddress((decodedTxn as any).snd),
      to: algosdk.encodeAddress((decodedTxn as any).rcv),
      amount: (decodedTxn as any).amt || 0,
      fee: (decodedTxn as any).fee || 0,
      firstRound: (decodedTxn as any).fv,
      lastRound: (decodedTxn as any).lv,
      genesisHash: (decodedTxn as any).gh,
      genesisID: (decodedTxn as any).gen,
      type: (decodedTxn as any).type,
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