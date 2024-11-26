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

    const senderAddr = (decodedTxn as any).snd ? 
      algosdk.encodeAddress((decodedTxn as any).snd) : 
      null;
    
    const receiverAddr = (decodedTxn as any).rcv ? 
      algosdk.encodeAddress((decodedTxn as any).rcv) : 
      null;

    console.log("Creating transaction with sender:", senderAddr, "receiver:", receiverAddr);

    if (!senderAddr || !receiverAddr) {
      throw new Error("Both sender and receiver addresses must be provided");
    }

    const suggestedParams: algosdk.SuggestedParams = {
      fee: (decodedTxn as any).fee || 1000,
      flatFee: true,
      firstValid: (decodedTxn as any).fv || 0,
      lastValid: (decodedTxn as any).lv || 0,
      genesisID: (decodedTxn as any).gen || '',
      genesisHash: (decodedTxn as any).gh || '',
      minFee: 1000
    };

    console.log("Suggested parameters:", suggestedParams);

    const txn = new algosdk.Transaction({
      from: senderAddr,
      to: receiverAddr,
      amount: (decodedTxn as any).amt || 0,
      fee: suggestedParams.fee,
      firstRound: suggestedParams.firstValid,
      lastRound: suggestedParams.lastValid,
      genesisHash: suggestedParams.genesisHash,
      genesisID: suggestedParams.genesisID,
      type: algosdk.TransactionType.pay,
      note: (decodedTxn as any).note ? new Uint8Array(Buffer.from((decodedTxn as any).note)) : undefined
    });

    console.log("Created Algorand transaction object:", txn);
    transactionCallback(txn);
  } catch (error) {
    console.error("Error handling transaction request:", error);
    throw error;
  }
}