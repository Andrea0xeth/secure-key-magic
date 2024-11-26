import * as algosdk from "algosdk";
import { Buffer } from 'buffer';
import { toast } from "@/hooks/use-toast";
import type { DecodedAlgorandTransaction } from "./types";

export const handleTransactionRequest = (
  txnParams: any, 
  callback: (transaction: algosdk.Transaction) => void
) => {
  try {
    console.log("Transaction params:", txnParams);
    
    const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64')) as DecodedAlgorandTransaction;
    console.log("Decoded transaction:", decodedTxn);
    
    const transaction = new algosdk.Transaction({
      type: decodedTxn.type,
      from: decodedTxn.snd,
      to: decodedTxn.rcv,
      amount: decodedTxn.amt || 0,
      fee: decodedTxn.fee || 0,
      firstRound: decodedTxn.fv || 0,
      lastRound: decodedTxn.lv || 0,
      note: decodedTxn.note,
      genesisID: decodedTxn.gen || '',
      genesisHash: decodedTxn.gh || '',
    });
    
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