import * as algosdk from "algosdk";
import { toast } from "@/hooks/use-toast";
import type { TransactionCallback, TransactionParams } from "./types";

export const handleTransactionRequest = async (
  txnParams: { txn: string }, 
  callback: TransactionCallback
) => {
  try {
    console.log("Processing transaction params:", txnParams);
    
    const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64')) as TransactionParams;
    console.log("Decoded transaction:", decodedTxn);
    
    const transaction = new algosdk.Transaction({
      type: decodedTxn.type,
      from: decodedTxn.snd,
      to: decodedTxn.rcv,
      amount: decodedTxn.amt,
      fee: decodedTxn.fee,
      firstRound: decodedTxn.fv,
      lastRound: decodedTxn.lv,
      note: decodedTxn.note,
      genesisID: decodedTxn.gen || '',
      genesisHash: decodedTxn.gh || '',
    });
    
    if (callback) {
      callback(transaction);
    } else {
      throw new Error("No transaction callback set");
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    toast({
      title: "Error",
      description: "Failed to process transaction",
      variant: "destructive",
    });
    throw error;
  }
};