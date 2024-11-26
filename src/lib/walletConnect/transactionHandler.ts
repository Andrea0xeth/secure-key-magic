import { SignClientTypes } from "@walletconnect/types";
import * as algosdk from "algosdk";
import { AlgorandTransaction } from "./types";

type TransactionCallback = (transaction: algosdk.Transaction) => void;
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
    const txnParams = algosdk.decodeObj(Buffer.from(params.txn, 'base64'));
    console.log("Decoded transaction params:", txnParams);

    if (!txnParams) {
      throw new Error("Invalid transaction parameters");
    }

    const transaction = new algosdk.Transaction(txnParams as algosdk.TransactionParams);
    console.log("Created transaction object:", transaction);

    transactionCallback(transaction);
  } catch (error) {
    console.error("Error handling transaction request:", error);
    throw error;
  }
}