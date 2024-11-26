import * as algosdk from "algosdk";
import { toast } from "@/hooks/use-toast";
import { DecodedAlgorandTransaction } from "./types";

let transactionCallback: ((transaction: algosdk.Transaction) => void) | null = null;

export function setTransactionCallback(callback: (transaction: algosdk.Transaction) => void) {
  transactionCallback = callback;
  console.log("Transaction callback set");
}

export function handleTransactionRequest(txnParams: any) {
  try {
    console.log("Transaction params:", txnParams);
    
    const decodedTxn = algosdk.decodeObj(new Uint8Array(Buffer.from(txnParams.txn, 'base64'))) as DecodedAlgorandTransaction;
    console.log("Decoded transaction:", decodedTxn);
    
    // Create suggested params from decoded transaction
    const suggestedParams: algosdk.SuggestedParams = {
      fee: decodedTxn.fee || 0,
      firstRound: decodedTxn.fv || 0,
      lastRound: decodedTxn.lv || 0,
      genesisID: decodedTxn.gen || '',
      genesisHash: decodedTxn.gh || '',
      flatFee: true,
    };

    // Create transaction object
    const transaction = new algosdk.Transaction({
      suggestedParams,
      from: algosdk.encodeAddress(decodedTxn.snd || new Uint8Array(32)),
      to: algosdk.encodeAddress(decodedTxn.rcv || new Uint8Array(32)),
      amount: decodedTxn.amt || 0,
      type: algosdk.TransactionType.pay
    });
    
    if (transactionCallback) {
      console.log("Calling transaction callback with transaction:", transaction);
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
  }
}