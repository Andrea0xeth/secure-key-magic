import * as algosdk from "algosdk";
import { SignClientTypes } from "@walletconnect/types";

let transactionCallback: ((transaction: algosdk.Transaction) => void) | null = null;

export function setTransactionCallback(callback: (transaction: algosdk.Transaction) => void) {
  transactionCallback = callback;
  console.log("Transaction callback set");
}

export async function handleTransactionRequest(
  requestEvent: SignClientTypes.EventArguments["session_request"]
): Promise<algosdk.Transaction[]> {
  try {
    console.log("Processing transaction request:", requestEvent);

    const { params } = requestEvent;
    if (!params) {
      throw new Error("No parameters provided in transaction request");
    }

    const txns = params.request.params.map((txnParams: any) => {
      console.log("Processing transaction parameters:", txnParams);
      
      const suggestedParams = {
        ...txnParams,
        fee: Number(txnParams.fee),
        flatFee: true,
        genesisID: txnParams.genesisID,
        genesisHash: txnParams.genesisHash,
      } as algosdk.SuggestedParams;

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: txnParams.sender,
        to: txnParams.receiver,
        amount: txnParams.amount,
        note: undefined,
        suggestedParams: suggestedParams
      });

      console.log("Created transaction:", txn);
      
      if (transactionCallback) {
        transactionCallback(txn);
      }
      
      return txn;
    });

    return txns;
  } catch (error) {
    console.error("Error processing transaction request:", error);
    throw error;
  }
}