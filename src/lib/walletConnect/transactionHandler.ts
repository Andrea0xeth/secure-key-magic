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

    const txnType = getTransactionType(decodedTxn);
    console.log("Transaction type:", txnType);

    let txn: algosdk.Transaction;
    const suggestedParams: algosdk.SuggestedParams = {
      fee: decodedTxn.fee || 1000,
      firstRound: decodedTxn.fv || 0,
      lastRound: decodedTxn.lv || 0,
      genesisID: decodedTxn.gen || '',
      genesisHash: decodedTxn.gh || '',
      flatFee: true
    };

    switch (txnType) {
      case "pay":
        txn = new algosdk.Transaction({
          type: algosdk.TransactionType.pay,
          from: algosdk.encodeAddress(decodedTxn.snd!),
          to: algosdk.encodeAddress(decodedTxn.rcv!),
          amount: decodedTxn.amt || 0,
          ...suggestedParams
        });
        break;

      case "axfer":
        txn = new algosdk.Transaction({
          type: algosdk.TransactionType.axfer,
          from: algosdk.encodeAddress(decodedTxn.snd!),
          to: algosdk.encodeAddress(decodedTxn.arcv || decodedTxn.rcv!),
          assetIndex: decodedTxn.xaid!,
          amount: decodedTxn.aamt || 0,
          ...suggestedParams
        });
        break;

      case "acfg":
        txn = new algosdk.Transaction({
          type: algosdk.TransactionType.acfg,
          from: algosdk.encodeAddress(decodedTxn.snd!),
          assetIndex: decodedTxn.caid,
          assetTotal: decodedTxn.apar?.t,
          assetDecimals: decodedTxn.apar?.dc,
          assetDefaultFrozen: decodedTxn.apar?.df,
          assetUnitName: decodedTxn.apar?.un,
          assetName: decodedTxn.apar?.an,
          assetURL: decodedTxn.apar?.au,
          assetMetadataHash: decodedTxn.apar?.am ? new Uint8Array(Buffer.from(decodedTxn.apar.am)) : undefined,
          ...suggestedParams
        });
        break;

      case "afrz":
        txn = new algosdk.Transaction({
          type: algosdk.TransactionType.afrz,
          from: algosdk.encodeAddress(decodedTxn.snd!),
          freezeAccount: algosdk.encodeAddress(decodedTxn.fadd!),
          assetIndex: decodedTxn.faid!,
          freezeState: decodedTxn.afrz!,
          ...suggestedParams
        });
        break;

      case "appl":
        txn = new algosdk.Transaction({
          type: algosdk.TransactionType.appl,
          from: algosdk.encodeAddress(decodedTxn.snd!),
          appIndex: decodedTxn.apid || 0,
          appOnComplete: decodedTxn.apan || 0,
          appArgs: decodedTxn.apaa,
          appAccounts: decodedTxn.apat?.map(addr => algosdk.encodeAddress(addr)),
          appForeignApps: decodedTxn.apfa,
          appForeignAssets: decodedTxn.apas,
          ...suggestedParams
        });
        break;

      default:
        throw new Error(`Unsupported transaction type: ${txnType}`);
    }

    if (decodedTxn.note) {
      txn.note = decodedTxn.note;
    }

    if (decodedTxn.grp) {
      txn.group = decodedTxn.grp;
    }

    console.log("Created Algorand transaction object:", txn);
    transactionCallback(txn);
  } catch (error) {
    console.error("Error handling transaction request:", error);
    throw error;
  }
}