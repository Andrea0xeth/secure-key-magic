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

export async function handleTransactionRequest(params: SignClientTypes.EventArguments["session_request"]) {
  console.log("Handling transaction request:", params);
  
  if (!transactionCallback) {
    console.error("No transaction callback set");
    throw new Error("No transaction callback set");
  }

  try {
    const txns = params.request.params.map((txnParams: any) => {
      console.log("Processing transaction parameters:", txnParams);
      
      const suggestedParams = {
        ...txnParams,
        fee: Number(txnParams.fee),
        flatFee: true,
        genesisID: txnParams.genesisID,
        genesisHash: txnParams.genesisHash,
      } as algosdk.SuggestedParams;

      const txn = new algosdk.Transaction({
        from: txnParams.sender,
        to: txnParams.receiver,
        amount: txnParams.amount,
        ...suggestedParams
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