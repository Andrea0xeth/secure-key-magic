import * as algosdk from "algosdk";
import { Buffer } from 'buffer';
import { toast } from "@/hooks/use-toast";
import type { DecodedAlgorandTransaction, TransactionParams } from "./types";

export const handleTransactionRequest = (
  txnParams: any, 
  callback: (transaction: algosdk.Transaction) => void
) => {
  try {
    console.log("Transaction params:", txnParams);
    
    const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64')) as DecodedAlgorandTransaction;
    console.log("Decoded transaction:", decodedTxn);
    
    const params: TransactionParams = {
      type: decodedTxn.type || 'pay',
      snd: decodedTxn.snd,
      rcv: decodedTxn.rcv,
      amt: decodedTxn.amt ? Number(decodedTxn.amt) : 0,
      fee: decodedTxn.fee || 0,
      fv: decodedTxn.fv || 0,
      lv: decodedTxn.lv || 0,
      note: decodedTxn.note,
      gen: decodedTxn.gen || '',
      gh: decodedTxn.gh || '',
    };
    
    const transaction = new algosdk.Transaction(params);
    callback(transaction);
  } catch (error) {
    console.error("Error processing transaction:", error);
    toast({
      title: "Error",
      description: "Failed to process transaction",
      variant: "destructive",
    });
  }
};