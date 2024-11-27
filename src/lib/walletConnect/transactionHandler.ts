import * as algosdk from "algosdk";
import { TransactionCallback } from "./types";
import { DecodedAlgorandTransaction, getTransactionType } from "./transactionTypes";

let transactionCallback: TransactionCallback | null = null;

export function setTransactionCallback(callback: TransactionCallback) {
  console.log("Setting transaction callback");
  transactionCallback = callback;
}

export function handleTransactionRequest(params: any) {
  console.log("Received transaction request with parameters:", params);

  if (!transactionCallback) {
    console.error("No transaction callback set");
    return;
  }

  try {
    const decodedTxn = algosdk.decodeObj(Buffer.from(params.txn, 'base64')) as DecodedAlgorandTransaction;
    console.log("Decoded transaction:", decodedTxn);

    if (!decodedTxn) {
      throw new Error("Failed to decode transaction");
    }

    if (!decodedTxn.snd) {
      throw new Error("Transaction must have a sender address");
    }

    const senderAddr = algosdk.encodeAddress(decodedTxn.snd);
    console.log("Sender address:", senderAddr);

    const suggestedParams: algosdk.SuggestedParams = {
      fee: decodedTxn.fee || 1000,
      firstRound: decodedTxn.fv || 0,
      lastRound: decodedTxn.lv || 0,
      genesisID: decodedTxn.gen || '',
      genesisHash: decodedTxn.gh || '',
      flatFee: true
    };

    let txn: algosdk.Transaction;
    const txnType = getTransactionType(decodedTxn);
    console.log("Transaction type:", txnType);

    switch (txnType) {
      case "pay":
        if (!decodedTxn.rcv) {
          throw new Error("Payment transaction must have a receiver address");
        }
        txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: senderAddr,
          to: algosdk.encodeAddress(decodedTxn.rcv),
          amount: decodedTxn.amt || 0,
          suggestedParams
        });
        break;

      case "axfer":
        if (!decodedTxn.arcv && !decodedTxn.rcv) {
          throw new Error("Asset transfer must have a receiver address");
        }
        txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: senderAddr,
          to: algosdk.encodeAddress(decodedTxn.arcv || decodedTxn.rcv!),
          assetIndex: decodedTxn.xaid!,
          amount: decodedTxn.aamt || 0,
          suggestedParams
        });
        break;

      case "appl":
        txn = algosdk.makeApplicationCallTxnFromObject({
          from: senderAddr,
          appIndex: decodedTxn.apid || 0,
          onComplete: decodedTxn.apan || 0,
          appArgs: decodedTxn.apaa || [],
          accounts: decodedTxn.apat?.map(addr => algosdk.encodeAddress(addr)) || [],
          foreignApps: decodedTxn.apfa || [],
          foreignAssets: decodedTxn.apas || [],
          suggestedParams
        });
        break;

      default:
        throw new Error(`Unsupported transaction type: ${txnType}`);
    }

    console.log("Created Algorand transaction object:", txn);
    transactionCallback(txn);
  } catch (error) {
    console.error("Error handling transaction request:", error);
    throw error;
  }
}