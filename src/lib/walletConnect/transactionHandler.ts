import * as algosdk from "algosdk";
import { SignClientTypes } from "@walletconnect/types";
import { formatJsonRpcResult } from "@json-rpc-tools/utils";

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
      
      const txn = new algosdk.Transaction({
        from: txnParams.sender,
        to: txnParams.receiver,
        amount: txnParams.amount,
        fee: txnParams.fee,
        firstRound: txnParams.firstRound,
        lastRound: txnParams.lastRound,
        genesisID: txnParams.genesisID,
        genesisHash: txnParams.genesisHash,
        type: txnParams.type,
      });

      console.log("Created transaction:", txn);
      return txn;
    });

    return txns;
  } catch (error) {
    console.error("Error processing transaction request:", error);
    throw error;
  }
}