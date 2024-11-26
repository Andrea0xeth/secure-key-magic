import { SignClientTypes } from "@walletconnect/types";
import * as algosdk from "algosdk";
import { AlgorandTransaction } from "./types";

type TransactionCallback = (transaction: AlgorandTransaction) => void;
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
    const decodedTxn = algosdk.decodeObj(Buffer.from(params.txn, 'base64'));
    console.log("Decoded transaction params:", decodedTxn);

    if (!decodedTxn) {
      throw new Error("Invalid transaction parameters");
    }

    const from = algosdk.encodeAddress((decodedTxn as any).snd);
    const to = algosdk.encodeAddress((decodedTxn as any).rcv);
    
    const transaction: AlgorandTransaction = {
      type: 'pay',
      from: from,
      to: to,
      amount: (decodedTxn as any).amt || 0,
      fee: (decodedTxn as any).fee || 0,
      group: (decodedTxn as any).grp,
      signTxn: (key: Uint8Array) => {
        console.log("Creating transaction object for signing");
        const txnObj = algosdk.Transaction.from_obj_for_encoding(decodedTxn as algosdk.TransactionParams);
        console.log("Transaction object created:", txnObj);
        const signedTxn = txnObj.signTxn(key);
        console.log("Transaction signed successfully");
        return signedTxn;
      }
    };

    console.log("Created transaction object:", transaction);
    transactionCallback(transaction);
  } catch (error) {
    console.error("Error handling transaction request:", error);
    throw error;
  }
}