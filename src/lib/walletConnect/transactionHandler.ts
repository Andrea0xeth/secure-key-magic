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
      genesisHash: decodedTxn.gh ? new Uint8Array(Buffer.from(decodedTxn.gh)) : new Uint8Array(32),
      flatFee: true
    };

    let transaction: algosdk.Transaction;

    // Handle different transaction types
    switch (decodedTxn.type) {
      case 'pay':
        transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: fromAddress,
          to: toAddress,
          amount: decodedTxn.amt || 0,
          suggestedParams
        });
        break;

      case 'axfer':
        transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: fromAddress,
          to: toAddress,
          amount: decodedTxn.amt || 0,
          assetIndex: decodedTxn.xaid || 0,
          suggestedParams
        });
        break;

      case 'acfg':
        transaction = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
          from: fromAddress,
          total: decodedTxn.t || 0,
          decimals: decodedTxn.dc || 0,
          defaultFrozen: false,
          unitName: decodedTxn.un || '',
          assetName: decodedTxn.an || '',
          suggestedParams
        });
        break;

      case 'afrz':
        transaction = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
          from: fromAddress,
          assetIndex: decodedTxn.faid || 0,
          freezeTarget: toAddress,
          freezeState: decodedTxn.afrz || false,
          suggestedParams
        });
        break;

      case 'appl':
        transaction = algosdk.makeApplicationCallTxnFromObject({
          suggestedParams,
          appIndex: decodedTxn.apid || 0,
          onComplete: decodedTxn.apan || 0,
          appArgs: decodedTxn.apaa || [],
          accounts: decodedTxn.apat || [],
          foreignApps: decodedTxn.apfa || [],
          foreignAssets: decodedTxn.apas || [],
          sender: fromAddress
        });
        break;

      default:
        console.log("Unknown transaction type, defaulting to payment transaction");
        transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: fromAddress,
          to: toAddress,
          amount: decodedTxn.amt || 0,
          suggestedParams
        });
    }
    
    const txnObj = transaction.get_obj_for_encoding();
    console.log("Created transaction object:", {
      txnType: txnObj.type,
      sender: algosdk.encodeAddress(txnObj.snd),
      receiver: txnObj.rcv ? algosdk.encodeAddress(txnObj.rcv) : undefined,
      amount: txnObj.amt
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