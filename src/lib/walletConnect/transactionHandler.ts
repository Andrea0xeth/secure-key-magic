import * as algosdk from "algosdk";
import { SignClientTypes } from "@walletconnect/types";
import { formatJsonRpcResult } from "@json-rpc-tools/utils";

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
      
      const suggestedParams: algosdk.SuggestedParams = {
        fee: txnParams.fee,
        flatFee: true,
        firstRound: txnParams.firstRound,
        lastRound: txnParams.lastRound,
        genesisID: txnParams.genesisID,
        genesisHash: txnParams.genesisHash,
      };

      const txn = algosdk.makePaymentTxnWithSuggestedParams(
        txnParams.sender,
        txnParams.receiver,
        txnParams.amount,
        undefined,
        undefined,
        suggestedParams
      );

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