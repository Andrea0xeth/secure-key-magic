import { toast } from "@/hooks/use-toast";
import * as algosdk from "algosdk";
import { DecodedAlgorandTransaction } from "./types";

let transactionCallback: ((transaction: algosdk.Transaction) => void) | null = null;

export function setTransactionCallback(callback: (transaction: algosdk.Transaction) => void) {
  transactionCallback = callback;
  console.log("Transaction callback set");
}

export function handleTransactionRequest(params: any) {
  try {
    console.log("Transaction params received:", params);
    
    if (!params?.txn) {
      console.error("No transaction data found in params");
      return;
    }

    const txnBuffer = Buffer.from(params.txn, 'base64');
    const decodedTxn = algosdk.decodeObj(txnBuffer) as DecodedAlgorandTransaction;
    console.log("Decoded transaction:", decodedTxn);
    
    if (!decodedTxn) {
      throw new Error("Failed to decode transaction");
    }

    // Create suggested params from decoded transaction
    const suggestedParams: algosdk.SuggestedParams = {
      fee: decodedTxn.fee || 0,
      firstRound: decodedTxn.fv || 0,
      lastRound: decodedTxn.lv || 0,
      genesisID: decodedTxn.gen || '',
      genesisHash: decodedTxn.gh || '',
      flatFee: true,
    };

    // Ensure addresses are properly handled
    const fromAddress = decodedTxn.snd ? algosdk.encodeAddress(decodedTxn.snd) : '';
    const toAddress = decodedTxn.rcv ? algosdk.encodeAddress(decodedTxn.rcv) : '';

    if (!fromAddress || !toAddress) {
      throw new Error("Invalid addresses in transaction");
    }

    // Create transaction object with proper typing
    const transaction = new algosdk.Transaction({
      from: fromAddress,
      to: toAddress,
      amount: decodedTxn.amt || 0,
      ...suggestedParams
    });
    
    console.log("Created transaction object:", {
      from: fromAddress,
      to: toAddress,
      amount: decodedTxn.amt || 0,
      fee: suggestedParams.fee
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
  }
}