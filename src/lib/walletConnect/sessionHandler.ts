import { SignClientType, TransactionCallback } from './types';
import * as algosdk from 'algosdk';

export function setupSessionHandlers(client: SignClientType, callback: TransactionCallback) {
  client.on("session_request", async (event) => {
    console.log("Received session request:", event);
    
    if (event.params?.request?.method === "algo_signTxn") {
      console.log("Received sign transaction request");
      
      try {
        const txnParams = event.params.request.params[0][0];
        console.log("Transaction params:", txnParams);
        
        const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64'));
        console.log("Decoded transaction:", decodedTxn);
        
        if (!decodedTxn) {
          throw new Error("Failed to decode transaction");
        }

        const senderAddr = (decodedTxn as any).snd ? 
          algosdk.encodeAddress((decodedTxn as any).snd) : 
          null;

        if (!senderAddr) {
          throw new Error("Sender address must not be null or undefined");
        }

        const receiverAddr = (decodedTxn as any).rcv ? 
          algosdk.encodeAddress((decodedTxn as any).rcv) : 
          senderAddr;

        const suggestedParams = {
          fee: (decodedTxn as any).fee || 1000,
          firstRound: (decodedTxn as any).fv || 0,
          lastRound: (decodedTxn as any).lv || 0,
          genesisID: (decodedTxn as any).gen || '',
          genesisHash: (decodedTxn as any).gh || '',
          flatFee: true
        };

        const txn = new algosdk.Transaction({
          from: senderAddr,
          to: receiverAddr,
          amount: (decodedTxn as any).amt || 0,
          ...suggestedParams
        });
        
        console.log("Created Algorand transaction object:", txn);
        callback(txn);
      } catch (error) {
        console.error("Error processing transaction:", error);
        throw error;
      }
    }
  });
}