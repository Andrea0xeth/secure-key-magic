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

    const senderAddr = (decodedTxn as any).snd ? algosdk.encodeAddress((decodedTxn as any).snd) : null;
    const receiverAddr = (decodedTxn as any).rcv ? algosdk.encodeAddress((decodedTxn as any).rcv) : null;

    if (!senderAddr) {
      console.error("Sender address is missing in transaction");
      throw new Error("Sender address must not be null or undefined");
    }

    console.log("Creating transaction with sender:", senderAddr, "receiver:", receiverAddr);

    const suggestedParams = {
      fee: (decodedTxn as any).fee || 1000,
      firstRound: (decodedTxn as any).fv || 0,
      lastRound: (decodedTxn as any).lv || 0,
      genesisID: (decodedTxn as any).gen || '',
      genesisHash: (decodedTxn as any).gh || '',
      flatFee: true
    };

    console.log("Suggested parameters:", suggestedParams);

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: senderAddr,
      to: receiverAddr || senderAddr,
      amount: (decodedTxn as any).amt || 0,
      suggestedParams: suggestedParams,
      note: (decodedTxn as any).note,
    });

    console.log("Created Algorand transaction object:", txn);
    transactionCallback(txn);
  } catch (error) {
    console.error("Error handling transaction request:", error);
    throw error;
  }
}