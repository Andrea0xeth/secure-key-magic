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

export async function handleTransactionRequest(params: any) {
  console.log("Handling transaction request:", params);
  
  if (!transactionCallback) {
    console.error("No transaction callback set");
    throw new Error("No transaction callback set");
  }

  try {
    const txns = params.params.map((txnParams: any) => {
      console.log("Processing transaction parameters:", txnParams);
      
      const suggestedParams: algosdk.SuggestedParams = {
        fee: Number(txnParams.fee),
        firstRound: txnParams.firstRound,
        lastRound: txnParams.lastRound,
        genesisID: txnParams.genesisID,
        genesisHash: txnParams.genesisHash,
        flatFee: true
      };

      const txn = new algosdk.Transaction({
        suggestedParams,
        amount: txnParams.amount,
        to: txnParams.receiver,
        from: txnParams.sender,
        type: txnParams.type
      });

      console.log("Created transaction:", txn);
      return txn;
    });

    console.log("Calling transaction callback with transaction:", txns[0]);
    transactionCallback(txns[0]);

  } catch (error) {
    console.error("Error processing transaction:", error);
    throw error;
  }
}