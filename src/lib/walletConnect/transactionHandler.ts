import * as algosdk from "algosdk";
import { toast } from "@/hooks/use-toast";
import type { TransactionCallback } from "./types";

export const handleTransactionRequest = async (
  txnParams: { txn: string }, 
  callback: TransactionCallback
) => {
  try {
    console.log("Processing transaction params:", txnParams);
    
    const txnBuffer = Buffer.from(txnParams.txn, 'base64');
    const transaction = algosdk.decodeSignedTransaction(txnBuffer).txn;
    
    console.log("Decoded transaction:", transaction);
    
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