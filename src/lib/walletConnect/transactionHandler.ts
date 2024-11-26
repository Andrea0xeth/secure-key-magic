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

    // Validate sender address
    if (!decodedTxn.snd) {
      throw new Error("Missing sender address");
    }

    const fromAddress = algosdk.encodeAddress(decodedTxn.snd);
    const toAddress = decodedTxn.rcv ? algosdk.encodeAddress(decodedTxn.rcv) : fromAddress;
    
    console.log("Transaction addresses:", { 
      from: fromAddress, 
      to: toAddress,
      type: decodedTxn.type
    });

    // Create suggested parameters
    const suggestedParams: algosdk.SuggestedParams = {
      fee: decodedTxn.fee || 0,
      firstRound: decodedTxn.fv || 0,
      lastRound: decodedTxn.lv || 0,
      genesisID: decodedTxn.gen || '',
      genesisHash: decodedTxn.gh ? Buffer.from(decodedTxn.gh).toString('base64') : '',
      flatFee: true
    };

    let transaction: algosdk.Transaction;

    // Handle different transaction types
    switch (decodedTxn.type) {
      case 'pay':
        transaction = algosdk.makePaymentTxnWithSuggestedParams(
          fromAddress,
          toAddress,
          decodedTxn.amt || 0,
          undefined,
          undefined,
          suggestedParams
        );
        break;

      case 'axfer': // Asset Transfer
        transaction = algosdk.makeAssetTransferTxnWithSuggestedParams(
          fromAddress,
          toAddress,
          undefined,
          undefined,
          decodedTxn.amt || 0,
          undefined,
          decodedTxn.xaid || 0, // Asset ID
          suggestedParams
        );
        break;

      case 'acfg': // Asset Configuration
        transaction = algosdk.makeAssetCreateTxnWithSuggestedParams(
          fromAddress,
          undefined,
          decodedTxn.t || 0, // Total supply
          decodedTxn.dc || 0, // Decimals
          false, // Default frozen
          undefined, // Manager address
          undefined, // Reserve address
          undefined, // Freeze address
          undefined, // Clawback address
          decodedTxn.un || '', // Unit name
          decodedTxn.an || '', // Asset name
          undefined, // URL
          undefined, // Metadata hash
          suggestedParams
        );
        break;

      case 'afrz': // Asset Freeze
        transaction = algosdk.makeAssetFreezeTxnWithSuggestedParams(
          fromAddress,
          undefined,
          decodedTxn.faid || 0, // Asset ID
          toAddress,
          decodedTxn.afrz || false,
          suggestedParams
        );
        break;

      case 'appl': // Application Call
        transaction = algosdk.makeApplicationCallTxnFromObject({
          from: fromAddress,
          suggestedParams,
          appIndex: decodedTxn.apid || 0,
          onComplete: decodedTxn.apan || 0,
          appArgs: decodedTxn.apaa || [],
          accounts: decodedTxn.apat || [],
          foreignApps: decodedTxn.apfa || [],
          foreignAssets: decodedTxn.apas || [],
        });
        break;

      default:
        console.log("Unknown transaction type, defaulting to payment transaction");
        transaction = algosdk.makePaymentTxnWithSuggestedParams(
          fromAddress,
          toAddress,
          decodedTxn.amt || 0,
          undefined,
          undefined,
          suggestedParams
        );
    }
    
    console.log("Created transaction object:", {
      txnType: transaction.type,
      sender: transaction.from,
      receiver: transaction.to,
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