import { toast } from "@/hooks/use-toast";
import * as algosdk from "algosdk";
import { AlgorandTransaction, EncodedTransaction } from "./types";

let transactionCallback: ((transaction: algosdk.Transaction) => void) | null = null;

export function setTransactionCallback(callback: (transaction: algosdk.Transaction) => void) {
  transactionCallback = callback;
  console.log("Transaction callback set");
}

export function handleTransactionRequest(params: EncodedTransaction) {
  try {
    console.log("Transaction params received:", params);
    
    if (!params?.txn) {
      console.error("No transaction data found in params");
      return;
    }

    const txnBuffer = Buffer.from(params.txn, 'base64');
    const decodedTxn = algosdk.decodeSignedTransaction(txnBuffer);
    console.log("Decoded transaction:", decodedTxn);
    
    if (!decodedTxn.txn) {
      throw new Error("Failed to decode transaction");
    }

    const transaction = decodedTxn.txn;

    // Validate sender address
    if (!transaction.from) {
      throw new Error("Missing sender address");
    }

    console.log("Transaction details:", {
      type: transaction.type,
      from: transaction.from.toString(),
      to: transaction.to?.toString(),
      amount: transaction.amount
    });

    if (transactionCallback) {
      console.log("Calling transaction callback with transaction");
      transactionCallback(transaction);
    } else {
      console.error("No transaction callback set");
      toast({
        title: "Error",
        description: "Transaction handler not initialized",
        variant: "destructive",
      });
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
}