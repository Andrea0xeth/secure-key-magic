import * as algosdk from "algosdk";
import { TransactionCallback } from "./types";

let transactionCallback: TransactionCallback | null = null;

export function setTransactionCallback(callback: TransactionCallback) {
  console.log("Setting transaction callback");
  transactionCallback = callback;
}

export function handleTransactionRequest(params: any) {
  console.log("Received transaction request with parameters:", params);

  if (!transactionCallback) {
    console.error("No transaction callback set");
    return;
  }

  try {
    const decodedTxn = algosdk.decodeObj(Buffer.from(params.txn, 'base64'));
    console.log("Decoded transaction:", decodedTxn);

    if (!decodedTxn) {
      throw new Error("Invalid transaction parameters");
    }

    const senderAddr = (decodedTxn as any).snd ? 
      algosdk.encodeAddress((decodedTxn as any).snd) : 
      null;

    if (!senderAddr) {
      throw new Error("Sender address must not be null or undefined");
    }

    const receiverAddr = (decodedTxn as any).rcv ? 
      algosdk.encodeAddress((decodedTxn as any).rcv) : 
      senderAddr;

    const suggestedParams: algosdk.SuggestedParams = {
      fee: (decodedTxn as any).fee || 1000,
      firstRound: (decodedTxn as any).fv || 0,
      lastRound: (decodedTxn as any).lv || 0,
      genesisID: (decodedTxn as any).gen || '',
      genesisHash: (decodedTxn as any).gh || '',
      flatFee: true
    };

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: senderAddr,
      to: receiverAddr,
      amount: (decodedTxn as any).amt || 0,
      suggestedParams: suggestedParams,
      note: (decodedTxn as any).note ? new Uint8Array(Buffer.from((decodedTxn as any).note)) : undefined
    });

    console.log("Created Algorand transaction object:", txn);
    transactionCallback(txn);
  } catch (error) {
    console.error("Error handling transaction request:", error);
    throw error;
  }
}