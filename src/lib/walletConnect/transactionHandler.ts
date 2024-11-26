import * as algosdk from "algosdk";
import { DecodedAlgorandTransaction } from "./transactionTypes";

let transactionCallback: ((transaction: algosdk.Transaction) => void) | null = null;

export const setTransactionCallback = (callback: (transaction: algosdk.Transaction) => void) => {
  console.log("Setting transaction callback");
  transactionCallback = callback;
};

export const handleTransactionRequest = async (txnParams: any) => {
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

    const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64')) as DecodedAlgorandTransaction;
    console.log("Decoded transaction:", decodedTxn);

    if (!decodedTxn) {
      throw new Error("Failed to decode transaction");
    }

    const suggestedParams: algosdk.SuggestedParams = {
      fee: decodedTxn.fee || 0,
      firstRound: decodedTxn.fv || 0,
      lastRound: decodedTxn.lv || 0,
      genesisHash: decodedTxn.gh ? new Uint8Array(Buffer.from(decodedTxn.gh)) : new Uint8Array(),
      genesisID: decodedTxn.gen || '',
      flatFee: true
    };

    const transaction = new algosdk.Transaction({
      suggestedParams,
      amount: decodedTxn.amt || 0,
      from: algosdk.encodeAddress(decodedTxn.snd || new Uint8Array()),
      to: algosdk.encodeAddress(decodedTxn.rcv || new Uint8Array()),
      type: decodedTxn.type || algosdk.TransactionType.pay
    });

    console.log("Created transaction object:", transaction);
    transactionCallback(transaction);

  } catch (error) {
    console.error("Error processing transaction:", error);
    throw error;
  }
};