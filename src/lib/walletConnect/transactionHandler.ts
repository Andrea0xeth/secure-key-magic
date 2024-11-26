import * as algosdk from 'algosdk';
import { toast } from "@/hooks/use-toast";
import { DecodedAlgorandTransaction, TransactionCallback } from './types';

let transactionCallback: TransactionCallback | null = null;

export function setTransactionCallback(callback: TransactionCallback) {
  transactionCallback = callback;
  console.log("Transaction callback set");
}

export function handleTransactionRequest(txnParams: any) {
  try {
    console.log("Transaction params:", txnParams);
    
    const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64')) as DecodedAlgorandTransaction;
    console.log("Decoded transaction:", decodedTxn);
    
    const transaction = new algosdk.Transaction({
      type: decodedTxn.type,
      snd: decodedTxn.snd,
      rcv: decodedTxn.rcv,
      amt: decodedTxn.amt || 0,
      fee: decodedTxn.fee || 0,
      fv: decodedTxn.fv || 0,
      lv: decodedTxn.lv || 0,
      note: decodedTxn.note,
      gen: decodedTxn.gen || '',
      gh: decodedTxn.gh || '',
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