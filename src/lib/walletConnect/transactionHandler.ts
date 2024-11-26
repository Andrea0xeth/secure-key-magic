import * as algosdk from "algosdk";
import { TransactionCallback } from "./types";

let transactionCallback: TransactionCallback | null = null;

export function setTransactionCallback(callback: TransactionCallback) {
  transactionCallback = callback;
}

export function handleTransactionRequest(params: any) {
  console.log("Ricevuta richiesta di transazione con parametri:", params);

  if (!transactionCallback) {
    console.error("Nessun callback di transazione impostato");
    return;
  }

  try {
    const decodedTxn = algosdk.decodeObj(Buffer.from(params.txn, 'base64'));
    console.log("Transazione decodificata:", decodedTxn);

    if (!decodedTxn) {
      throw new Error("Parametri transazione non validi");
    }

    const senderAddr = (decodedTxn as any).snd ? 
      algosdk.encodeAddress((decodedTxn as any).snd) : 
      null;

    const receiverAddr = (decodedTxn as any).rcv ? 
      algosdk.encodeAddress((decodedTxn as any).rcv) : 
      null;

    if (!senderAddr || !receiverAddr) {
      throw new Error("Gli indirizzi del mittente e del destinatario sono obbligatori");
    }

    console.log("Creazione transazione con mittente:", senderAddr, "destinatario:", receiverAddr);

    const suggestedParams: algosdk.SuggestedParams = {
      fee: (decodedTxn as any).fee || 1000,
      flatFee: true,
      firstRound: (decodedTxn as any).fv || 0,
      lastRound: (decodedTxn as any).lv || 0,
      genesisID: (decodedTxn as any).gen || '',
      genesisHash: (decodedTxn as any).gh || '',
    };

    const txn = new algosdk.Transaction({
      from: senderAddr,
      to: receiverAddr,
      amount: (decodedTxn as any).amt || 0,
      fee: suggestedParams.fee,
      firstRound: suggestedParams.firstRound,
      lastRound: suggestedParams.lastRound,
      genesisHash: suggestedParams.genesisHash,
      genesisID: suggestedParams.genesisID,
      type: algosdk.TransactionType.pay,
      note: (decodedTxn as any).note ? new Uint8Array(Buffer.from((decodedTxn as any).note)) : undefined
    });

    console.log("Oggetto transazione Algorand creato:", txn);
    transactionCallback(txn);
  } catch (error) {
    console.error("Errore nella gestione della richiesta di transazione:", error);
    throw error;
  }
}