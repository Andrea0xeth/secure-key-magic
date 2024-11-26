import * as algosdk from "algosdk";
import { SignClientTypes } from "@walletconnect/types";

let transactionCallback: ((transaction: algosdk.Transaction) => void) | null = null;

export function setTransactionCallback(callback: (transaction: algosdk.Transaction) => void) {
  console.log("Setting transaction callback");
  transactionCallback = callback;
}

export function clearTransactionCallback() {
  console.log("Clearing transaction callback");
  transactionCallback = null;
}

export async function handleTransactionRequest(txnParams: any) {
  console.log("Handling transaction request:", txnParams);
  
  if (!transactionCallback) {
    console.error("No transaction callback set");
    throw new Error("No transaction callback set");
  }

  try {
    if (!txnParams || !txnParams.txn) {
      console.error("Invalid transaction parameters:", txnParams);
      throw new Error("Invalid transaction parameters");
    }

    const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64'));
    console.log("Decoded transaction:", decodedTxn);

    if (!decodedTxn) {
      throw new Error("Failed to decode transaction");
    }

    const suggestedParams: algosdk.SuggestedParams = {
      fee: 0,
      firstRound: 0,
      lastRound: 0,
      genesisHash: '',
      genesisID: '',
      flatFee: true
    };

    const transaction = new algosdk.Transaction({
      from: (decodedTxn as any).snd?.toString(),
      to: (decodedTxn as any).rcv?.toString(),
      amount: (decodedTxn as any).amt || 0,
      suggestedParams
    });

    console.log("Created transaction object:", transaction);
    transactionCallback(transaction);

  } catch (error) {
    console.error("Error processing transaction:", error);
    throw error;
  }
}